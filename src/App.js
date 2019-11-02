import React, { Component } from "react";
import "./App.css";
import HandInput from "./HandInput";
const axios = require("axios");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueList: [{ row: 0, left: "", right: "", operation: "" }],
      editorList: [null],
      solution: 0
    };
  }

  componentDidMount() {
    axios
      .post("http://gialale.herokuapp.com/calculate/solve", {
        input: "(2+x)^2 = (x+1)(x-1)"
      })
      .then(response => {
        this.setState({ solution: response.data.result });
        console.log("Saved Result: " + response.data.result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onDataChanged(data) {
    this.setState(
      {
        valueList: [
          ...this.state.valueList.filter(rowData => rowData.row !== data.row),
          {
            ...this.state.valueList.find(rowData => rowData.row === data.row),
            ...data
          }
        ]
      },
      () => console.log(this.state.valueList)
    );
  }

  render() {
    return (
      <div style={contentStyle}>
        <h1 style={{ marginBottom: 20 }}>Solve for x</h1>
        <img
          src="https://math.now.sh?from=(2%2Bx)%5E2%20%3D%20(x%2B1)(x-1)"
          width={700}
          alt="Equation to be solved"
          style={{ marginBottom: 30, padding: 10, backgroundColor: "white" }}
        />
        {this.state.editorList.map((data, i) => {
          return (
            <div key={i} style={equationStyle}>
              <HandInput
                type={"left"}
                row={i}
                onDataChanged={data => this.onDataChanged(data)}
              />
              <div style={equalsStyle}> = </div>
              <HandInput
                type={"right"}
                row={i}
                onDataChanged={data => this.onDataChanged(data)}
              />

              <HandInput
                style={operationStyle}
                smallInput={true}
                type={"operation"}
                row={i}
                onDataChanged={data => this.onDataChanged(data)}
              />
            </div>
          );
        })}
        <div style={{ marginTop: 30, marginBottom: 600 }}>
          <button
            onClick={() =>
              this.setState({
                valueList: [
                  ...this.state.valueList,
                  {
                    row: this.state.valueList.length,
                    left: "",
                    right: "",
                    operation: ""
                  }
                ],
                editorList: [...this.state.editorList, null]
              })
            }
          >
            Add equation step
          </button>
          <button
            onClick={() => {
              this.state.editorList.forEach(row => {
                console.log(row);
                axios
                  .post("http://gialale.herokuapp.com/calculate/compare", {
                    lhs: row.left,
                    rhs: row.right,
                    x: this.state.solution
                  })
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.log(error);
                  });
              });
            }}
            style={{ marginLeft: 30 }}
          >
            Check
          </button>
        </div>
      </div>
    );
  }
}

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background:
    "no-repeat url(//s.ytimg.com/yt/imgbin/www-refreshbg-vflC3wnbM.png) 0 0",

  backgroundRepeat: "repeat",
  backgroundSize: "40px 40px",
  backgroundImage:
    "linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)"
};

const equalsStyle = {
  margin: 30
};

const operationStyle = {
  marginLeft: 80
};

const equationStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center"
};

export default App;
