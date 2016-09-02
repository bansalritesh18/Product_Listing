import React from 'react';
import ReactDOM from 'react-dom';
import List from "./List.js";
import Captcha from "./Captcha.js"
import {fetchData} from "./Api.js";

var url = "http://127.0.0.1:5000";

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.verifyCaptcha = this.verifyCaptcha.bind(this);
        this.onReloadCaptcha = this.onReloadCaptcha.bind(this);
        this.state.isUserVerified = localStorage.getItem("isUserVerified");
    }

    onReloadCaptcha() {
        this.setState({error: false});
    }

    verifyCaptcha() {
        fetchData(`${url}/verifyCaptcha`, {captcha: this.state.inputValue}).then((result)=> {
            if (result && result.isUserVerified) {
                localStorage.setItem("isUserVerified", "true");
                this.setState({isUserVerified: true});
            }
        }).catch((err)=> {
            this.setState({error: err});
        })
    }

    render() {
        if (this.state.isUserVerified) {
            return (
                <List />
            )
        } else {
            return (
                <div>
                    <input type="text" onChange={(e)=>{this.state.inputValue = e.target.value}}/>

                    <Captcha onReload={this.onReloadCaptcha} url={url}/>

                    <div onClick={this.verifyCaptcha}>Verify Captcha</div>
                    {this.state.error && <div className="error">{this.state.error.message}</div>}
                </div>
            )
        }
    }
}

ReactDOM.render((
    <Root />
), document.getElementById('root'));


