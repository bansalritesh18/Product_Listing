import React from 'react';
import ReactDOM from 'react-dom';


class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, hasMoreData: true};
        this.renderRow = this.renderRow.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    onScroll(event) {
        if (this.state.fetchingMoreData || !this.state.hasMoreData) {
            return;
        }
        var {scrollTop,scrollHeight,clientHeight} = event.target;

        if ((scrollHeight * (80 / 100) <= scrollTop) || (scrollTop >= scrollHeight - clientHeight)) {
            this.setState({fetchingMoreData: true});
            this.state.limit = 20;
            this.state.skip = this.state.skip || 20;
            this.state.skip = this.state.skip + this.state.limit;
            this.fetchData({skip: this.state.skip, limit: this.state.limit});
        }
    }

    componentDidUpdate() {
        if (this.listRef && !this.scrollListenerAdded) {
            this.scrollListenerAdded = true;
            this.listRef.addEventListener('scroll', e=> {
                this.onScroll(e)
            });
        }
    }

    fetchData(params) {
        return fetchData(params).then((result)=> {
            if (result.length === 0) {
                this.state.hasMoreData = false;
            }
            if (this.state.data) {
                this.state.data.push.apply(this.state.data, result);
            } else {
                this.state.data = result;
            }
            this.setState({fetchingMoreData: false, loaded: true});
        }).catch((err)=> {
            this.setState({fetchingMoreData: false, loaded: true, error: err});
        })
    }

    componentDidMount() {
        this.fetchData();
    }

    renderRow(row, index) {
        return (
            <div key={`row_`+index} ref={(ref)=>{this.listRef = ref;}} className="rowStyle">
                <div>
                    {row.name}
                </div>
            </div>
        )
    }

    render() {
        if (!this.state.loaded) {
            return <div>Loading data....</div>
        }
        if (this.state.error) {
            return <div>{this.state.error.message || this.state.error.stack}</div>
        }
        var dataToShow = this.state.data.map(this.renderRow) || [];
        return (
            <div style={{flex:1,display:"flex",flexDirection:"column"}}>
                <div className="rows" onScroll={this.onScroll}>
                    {dataToShow}
                </div>
                {this.state.fetchingMoreData &&
                <div style={{backgroundColor:"black",padding:10}}>
                    <span style={{color:"whitesmoke"}}>Loading More data....</span>
                </div>
                }
            </div>
        )
    }
}


function fetchData(params = {}) {
    var requiredURL = "http://127.0.0.1:5000/";
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: requiredURL,
            data: params,
            success: function (returnData, status, xhr) {
                if (returnData.status === "error") {
                    reject(new Error(returnData.error.message));
                    return;
                }
                resolve(returnData.data);
            },
            error: function (err) {
                if (err.responseText === "") {
                    err = new Error("Please start your server.")
                }
                reject(err)
            },
            dataType: 'JSON',
            async: true
        });
    });
}

ReactDOM.render((
    <List />
), document.getElementById('root'));


