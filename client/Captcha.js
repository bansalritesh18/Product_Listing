import React from "react";

export default class Captcha extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps() {
        this.skipRender = true;
    }

    shouldComponentUpdate() {
        return !this.skipRender;
    }

    onClick() {
        this.skipRender = false;
        this.setState({}, ()=> {
            this.props.onReload();
        });
    }

    render() {
        var imageURL = `${this.props.url}/captcha?random=${new Date().getTime()}`;
        return (
            <div className="captchaContainer">
                <img src={imageURL}/>

                <div onClick={this.onClick} style={{marginLeft:15}}>
                    <img src={"./images/reload.jpg"} className="reload"/>
                </div>
            </div>
        )
    }
}
