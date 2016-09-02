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
        var imageURL = `${this.props.url}/captcha?random=${Math.random()}`;
        return (
            <div>
                <img src={imageURL}/>

                <div onClick={this.onClick}>Reload Captcha</div>

            </div>
        )
    }
}
