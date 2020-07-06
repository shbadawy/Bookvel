import React from "react";
import ReactDOM from "react-dom";
import Experts from "./experts/Experts";
import Profile from "./experts/Profile";
import BookForm from "./experts/BookForm";
import NavBar from "./partials/NavBar";
import Footer from "./partials/Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <NavBar />
            <div className="container relative min-h-screen mx-auto">
                {location.pathname.match("/") ? <Experts /> : null}
                <Switch>
                    <Route exact path="/experts" component={Experts} />
                    <Route exact path="/experts/:id" component={Profile} />
                    <Route excat path="/book" component={BookForm} />
                </Switch>
            </div>
            <Footer />
        </Router>
    );
}

if (document.getElementById("app")) {
    ReactDOM.render(<App />, document.getElementById("app"));
}