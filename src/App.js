import React, { Component } from "react";
import "./App.css";
import HandInput from "./HandInput";
import getExcercise from "./generator";
const axios = require("axios");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueList: [{ row: 0, left: "", right: "", operation: "" }],
      solution: 0,
      level: 1,
      exercise: getExcercise(1)
    };
  }

  componentDidMount() {
    this.onLevelChanged(0);
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
    if (this.state.level + selection < 1 || this.state.level + selection > 3) {
      return;
    }

    const newLevel = this.state.level + selection;
    const newExercise = getExcercise(newLevel);
    this.setState({
      level: newLevel,
      exercise: newExercise,
      loading: false,
      valueList: []
    }, () => {
      this.setState({
        valueList: [{ row: 0, left: "", right: "", operation: "" }]
      })
    });


    axios
      .post("https://gialale.herokuapp.com/calculate/solve", {
        input: newExercise
      })
      .then(response => {
        this.setState({ solution: response.data.result });
        console.log(response.data.result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div style={contentStyle}>
        <h1 style={{ marginBottom: 20 }}>Solve for x</h1>
        <h4 style={{ marginBottom: 10, marginTop: 0 }}>
          <button
            onClick={() => this.onLevelChanged(-1)}
            style={{ marginRight: 30 }}
          >
            <i className="far fa-hand-point-left" />
          </button>

          Level {this.state.level}

          <button
            onClick={() => this.onLevelChanged(1)}
            style={{ marginLeft: 30 }}
          >
            <i className="far fa-hand-point-right" />
          </button>
        </h4>
        <div>
          <br />
          <img
            src={`https://math.now.sh?from=${encodeURIComponent(
              this.state.exercise
            )}`}
            width={700}
            alt="Equation to be solved"
            style={{
              marginBottom: 30,
              padding: 30,
              backgroundColor: "white"
            }}
          />

        </div>
        {this.state.valueList.map((value, i) => {
          const { correct } = value;
          return (
            <div key={"equation" + i} style={equationStyle}>
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
            onClick={() => {
              this.setState({
                valueList: [
                  ...this.state.valueList,
                  {
                    row: this.state.valueList.length,
                    left: "",
                    right: "",
                    operation: ""
                  }
                ].sort((a, b) => a.row > b.row)
              });
            }}
          >
            <i className="fa fa-plus-circle" /> Add equation step
          </button>
          <button
            onClick={() => {
              this.setState({ loading: true });
              Promise.all(this.state.valueList.map(row => {
                if (row && row.left && row.right) {
                  return axios
                    .post("https://gialale.herokuapp.com/calculate/compare", {
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
              })).then(() => {
                this.setState({ loading: false });
              });
            }}
            style={{ marginLeft: 30 }}
          >
            { this.state.loading ? <i className="fa fa-spinner fa-spin" /> : <React.Fragment><i className="fa fa-calculator"/> Check</React.Fragment> }
          </button>
          <button onClick={() => alert("x = " + this.state.solution)} style={{ marginLeft: 30 }}>
            <i className="fa fa-equals" /> Show solution
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

const exerciseStyle = {
  display: "flex",
  flexDirection: "row"
};

const equalsStyle = {
  fontSize: "100pt",
  fontWeight: "bold",
  margin: 30,
  marginTop: "70px",
  fontFamily: '"Patrick Hand SC",sans-serif'
};

const operationStyle = {
  marginLeft: 80
};

const operationSeparatorStyle = {
  height: "100%",
  fontSize: "100pt",
  marginLeft: "60px",
  marginRight: "0px",
  marginTop: "70px",
  fontFamily: '"Patrick Hand SC",sans-serif'
};

const equationStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "70px"
};

export default App;
