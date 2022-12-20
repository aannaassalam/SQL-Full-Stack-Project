import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="bottom" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

function App() {
  const [user_count, setUser_count] = useState(0);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [email, setEmail] = useState("");
  const [errmsg, setErrmsg] = useState("");
  const [toggle, setToggle] = useState(true);
  const [filter, setFilter] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [yearRange, setYearRange] = useState([2016, 2022]);

  useEffect(() => {
    if (refresh) {
      Promise.all([
        axios.get("http://localhost:5000/total_users"),
        axios.get("http://localhost:5000/users"),
      ])
        .then(([res1, res2]) => {
          setUser_count(res1.data);
          setUsers(res2.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setRefresh(false));
    }
  }, [refresh]);

  useEffect(() => {}, [users]);

  const add_user = () => {
    if (email && email.includes("@")) {
      axios
        .post("http://localhost:5000/add_user", { email })
        .then((res) => console.log("Submitted"))
        .catch((err) => {
          if (err.response.status === 409) {
            setErrmsg("User Already Subscribed!");
            setTimeout(() => setErrmsg(""), 4000);
          }
          console.log(err);
        })
        .finally(() => setRefresh(true));
    } else {
      setErrmsg("Enter a valid Email!");
      setTimeout(() => setErrmsg(""), 4000);
    }
  };

  // const marks = [
  //   {
  //     value: 2016,
  //     label: "2016",
  //   },
  //   {
  //     value: 2017,
  //     label: "2017",
  //   },
  //   {
  //     value: 2018,
  //     label: "2018",
  //   },
  //   {
  //     value: 2019,
  //     label: "2019",
  //   },
  //   {
  //     value: 2020,
  //     label: "2020",
  //   },
  //   {
  //     value: 2021,
  //     label: "2021",
  //   },
  //   {
  //     value: 2022,
  //     label: "2022",
  //   },
  // ];

  return (
    <div className="App">
      <div className={`slider ${toggle && "in"}`}>
        <div className="background"></div>
        {errmsg && (
          <div className="notification">
            <p>{errmsg}</p>
            <span className="progress"></span>
          </div>
        )}
        <button
          className="list_users"
          onClick={() => {
            setToggle((prev) => !prev);
          }}
        >
          <i className={`fas fa-chevron-left ${toggle && "right"}`}></i>
          <span className={!toggle ? "move-out" : "move-in hide"}>Hide</span>
          <span className={toggle ? "move-out" : "move-in"}>List Users</span>
        </button>
        <h1>JOIN US</h1>
        <h3>
          Enter your email to join <strong>{user_count}</strong> others on our
          waitlist. We are 100% not a cult.
        </h3>
        <div className="input-sec">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={add_user}>Join</button>
        </div>
      </div>
      <div className={toggle ? "users_list fade-in" : "users_list fade-out"}>
        <h4>List of Users</h4>
        <p className="grey-text">
          Below is a list of users that have subscribed to our newsletter.
        </p>
        <div className="users">
          <div className="header-row">
            <span>Sr No.</span>
            <span>
              Email ID{" "}
              <button onClick={() => setFilter((prev) => !prev)}>
                <i class="fa-solid fa-filter"></i>
              </button>
            </span>
          </div>
          <div className="users-inner">
            {users.map((user, idx) => (
              <div className="row">
                <span>{idx + 1}</span>
                <span>{user.email}</span>
              </div>
            ))}
            <div className={`filter-box ${filter && "active"}`}>
              <div className="filter-row">
                <p>Sort by: </p>
                <div className="sort-slider">
                  <span
                    className={sortBy === "newest" ? "glider" : "glider right"}
                  ></span>
                  <span onClick={() => setSortBy("newest")}>Newest</span>
                  <span onClick={() => setSortBy("oldest")}>Oldest</span>
                </div>
              </div>
              <div className="filter-row">
                <p>Years: </p>
                <div
                  style={{
                    width: "75%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    marginLeft: "auto",
                  }}
                >
                  <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={yearRange}
                    min={2016}
                    step={1}
                    max={2022}
                    onChange={(_, value) => setYearRange(value)}
                    disableSwap
                    valueLabelDisplay="auto"
                    components={{
                      ValueLabel: ValueLabelComponent,
                    }}
                    sx={{
                      color: "#1F75FE",
                      height: 4,
                      "& .MuiSlider-thumb": {
                        width: 8,
                        height: 8,
                        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                        "&:before": {
                          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                        },
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
                        },
                        "&.Mui-active": {
                          width: 14,
                          height: 14,
                        },
                      },
                      "& .MuiSlider-rail": {
                        opacity: 0.28,
                      },
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      fontSize: 12,
                      width: "110%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>2016</span>
                    <span>2022</span>
                  </div>
                </div>
              </div>
              <div className="filter-row">
                <div className="providerBox active">
                  All
                  <i className="fas fa-check"></i>
                </div>
                {}
              </div>
            </div>
          </div>
        </div>
        <p className="disclaimer">
          Note: All the user listed above are fictional and there's no threat to
          anyone's privacy
        </p>
      </div>
    </div>
  );
}

export default App;
