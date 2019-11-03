import React, { Component } from "react";
import "./App.css";
import HandInput from "./HandInput";
const axios = require("axios");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueList: [{ row: 0, left: "", right: "", operation: "" }],
      solution: 0,
      level: 1
    };
  }

  componentDidMount() {
    axios
      .post("http://gialale.herokuapp.com/calculate/solve", {
        input: "(2+x)^2 = (x+1)(x-1)"
      })
      .then(response => {
        this.setState({ solution: response.data.result });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onDataChanged(data) {
    this.setState({
      valueList: [
        ...this.state.valueList.filter(rowData => rowData.row !== data.row),
        {
          ...this.state.valueList.find(rowData => rowData.row === data.row),
          ...data
        }
      ]
    });
  }

  onLevelChanged(selection) {
    this.setState({ level: this.state.level + selection });
    this.setState({ valueList: [{ row: 0, left: "", right: "", operation: "" }],})
  }

  render() {
    return (
      <div style={contentStyle}>
        <h1 style={{ marginBottom: 0 }}>Solve for x</h1>
        <h4 style={{ marginBottom: 40, marginTop: 0 }}>Level { this.state.level }</h4>
        <button onClick={() => this.onLevelChanged(-1) }>Previous Level</button><br/>
        <img
          src="https://math.now.sh?from=(2%2Bx)%5E2%20%3D%20(x%2B1)(x-1)"
          width={700}
          alt="Equation to be solved"
          style={{ marginBottom: 30, padding: 10, backgroundColor: "white" }}
        />
        <button onClick={() => this.onLevelChanged(1) }>Next Level</button>
        {this.state.valueList.map((value, i) => {
          const { correct } = value;
          return (
            <div key={i} style={equationStyle}>
              <HandInput
                type={"left"}
                row={i}
                correct={correct}
                onDataChanged={data => this.onDataChanged(data)}
              />
              <div style={equalsStyle}> = </div>
              <HandInput
                type={"right"}
                row={i}
                correct={correct}
                onDataChanged={data => this.onDataChanged(data)}
              />
              <div style={operationSeparatorStyle}> | </div>
              <HandInput
                style={operationStyle}
                smallInput={true}
                type={"operation"}
                row={i}
                correct={correct}
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
                valueList: [...this.state.valueList, false].sort(
                  (a, b) => a.row > b.row
                )
              })
            }
          >
            Add equation step
          </button>
          <button
            onClick={() => {
              this.state.valueList.forEach(row => {
                if (row) {
                  axios
                    .post("http://gialale.herokuapp.com/calculate/compare", {
                      lhs: row.left,
                      rhs: row.right,
                      x: this.state.solution
                    })
                    .then(response => {
                      const checkedValueList = this.state.valueList;
                      const checkedRow = checkedValueList.find(
                        value => value.row === row.row
                      );
                      if (response.data.result === "False") {
                        checkedRow.correct = false;
                      } else {
                        checkedRow.correct = true;
                      }
                      this.setState({ valueList: checkedValueList });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }
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
    "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)"
};

const equalsStyle = {
  fontSize: "60pt",
  fontWeight: "bold",
  margin: 30,
  marginTop: "70px"
};

const operationStyle = {
  marginLeft: 80
};

const operationSeparatorStyle = {
  height: "100%",
  fontSize: "100pt",
  marginLeft: "60px",
  marginRight: "0px",
  marginTop: "70px"
};

const equationStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "70px"
};

export default App;
