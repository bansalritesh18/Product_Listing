import React from "react";
import {fetchData} from "./Api.js";

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {skip: 0, limit: 20, loaded: false, hasMoreData: true};
        this.renderRow = this.renderRow.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    onScroll(event) {
        if (this.state.fetchingMoreData || !this.state.hasMoreData) {
            return;
        }
        var {scrollTop,scrollHeight,clientHeight} = event.target;
        if ((scrollHeight * (80 / 100) <= scrollTop) || (scrollTop >= scrollHeight - clientHeight - 200)) {
            this.setState({fetchingMoreData: true});
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
        return fetchData("/getData", params, "GET").then((result)=> {
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
        this.fetchData({skip: this.state.skip, limit: this.state.limit});
    }

    renderRow(row, index) {
        return (
            <div key={`row_`+index} ref={(ref)=>{this.listRef = ref;}}
                 className="rowStyle">
                <div>{row.model}</div>
                <div>{row.price}</div>
                <div>{row.description}</div>
                <div>{row.title}</div>
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
