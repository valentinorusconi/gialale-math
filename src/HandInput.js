import React, { Component } from "react";
import * as MyScriptJS from "myscript";
import "myscript/dist/myscript.min.css";

class HandInput extends Component {
  componentDidMount() {
    const editorConfig = {
      recognitionParams: {
        type: "MATH",
        protocol: "WEBSOCKET",
        apiVersion: "V4",
        server: {
          scheme: "https",
          host: "webdemoapi.myscript.com",
          applicationKey: "1463c06b-251c-47b8-ad0b-ba05b9a3bd01",
          hmacKey: "60ca101a-5e6d-4159-abc5-2efcbecce059"
        }
      }
    };

    this.editor = MyScriptJS.register(this.refs.editor, editorConfig);

    this.editor.domElement.addEventListener("exported", event => {
      if (
        this.props.onDataChanged &&
        this.props.type &&
        event.srcElement.editor.model.exports
      ) {
        this.props.onDataChanged({
          row: this.props.row,
          [this.props.type]:
            event.srcElement.editor.model.exports["application/x-latex"]
        });
      }
    });
  }

  render() {
    let color = "white";
    if (this.props.correct === true) {
      color = "#00e699";
    } else if (this.props.correct === false) {
      color = "#FFA07A";
    }

    return (
      <div style={{ marginLeft: this.props.smallInput ? 80 : 0 }}>
        <div className="row flex-spaces child-borders">
          <button onClick={() => this.editor.undo()}>
            <i className="fa fa-undo"></i>
          </button>
          <button onClick={() => this.editor.redo()}>
            <i className="fa fa-redo"></i>
          </button>
          <button onClick={() => this.editor.clear()}>
            <i className="fa fa-trash"></i>
          </button>
        </div>

        <div
          style={{
            ...editorStyle,
            background: color,
            width: this.props.smallInput ? "10vw" : "33vw",
            borderColor: 'black'
          }}
          className="border border-3 border-primary"
          ref="editor"
          touch-action="none"
        ></div>
      </div>
    );
  }
}

const editorStyle = {
  minWidth: "100px",
  minHeight: "100px",
  height: "calc(311px - 190px)",
  touchAction: "none",
  borderBottom: 2,
  borderStyle: "solid",
  //   borderColor: "black",
  backgroundColor: "white"
  //   background:
  //     "no-repeat url(//s.ytimg.com/yt/imgbin/www-refreshbg-vflC3wnbM.png) 0 0",
  //   backgroundColor: "lightgrey"
  //   backgroundRepeat: "repeat",
  //   backgroundSize: "40px 40px",
  //   backgroundImage:
  //     "linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)"
};

export default HandInput;
