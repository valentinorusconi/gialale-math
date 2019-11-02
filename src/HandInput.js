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
          //   type: this.props.type,
          row: this.props.row,
          [this.props.type]:
            event.srcElement.editor.model.exports["application/x-latex"]
        });
      }
    });
  }

  render() {
    return (
      <div style={{ marginLeft: this.props.smallInput ? 80 : 0 }}>
        <div style={flexBoxLineCentered}>
          <button onClick={() => this.editor.undo()}>Undo</button>
          <button onClick={() => this.editor.redo()}>Redo</button>
          <button onClick={() => this.editor.clear()}>Clear</button>
        </div>

        <div
          style={{
            ...editorStyle,
            width: this.props.smallInput ? "10vw" : "33vw"
          }}
          ref="editor"
          touch-action="none"
        ></div>
      </div>
    );
  }
}

const flexBoxLineCentered = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
  marginTop: 20
};

const editorStyle = {
  minWidth: "100px",
  minHeight: "100px",
  height: "calc(311px - 190px)",
  touchAction: "none",
  borderBottom: 2,
  borderStyle: "solid",
  borderColor: "black"
  //   background:
  //     "no-repeat url(//s.ytimg.com/yt/imgbin/www-refreshbg-vflC3wnbM.png) 0 0",
  //   backgroundColor: "lightgrey"
  //   backgroundRepeat: "repeat",
  //   backgroundSize: "40px 40px",
  //   backgroundImage:
  //     "linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)"
};

export default HandInput;
