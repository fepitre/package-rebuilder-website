'use strict';

import React from 'react';

import { render } from 'react-dom';
// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
// } from "react-router-dom";

import { Project } from './project';


function ProjectsList() {
    return (
        <section className="section pt-4 pb-4">
            <div className="box tile has-text-centered has-background-info">
                <a href="/qubesos.html">
                    <div className="section pt-4 pb-4">
                        <h2>Qubes OS</h2>
                        <img width="50" src="/images/qubesos.svg" />
                    </div>
                </a>
                <div className="section pt-4 pb-4">
                    <a href="/debian.html">
                        <h2>Debian</h2>
                        <img width="50" src="/images/debian-nd.svg" />
                    </a>
                </div>
            </div>
        </section>
    )
}

function Header() {
    return (
        <div className="hero-body">
            <div id="status">
                <div align="center"><a href="https://reproducible-builds.org/"><img width="200" src="/images/reproducible_builds.svg" /></a></div>
                <h1 className="title"><a href="/">PackageRebuilder</a></h1>
                <p>Welcome to the <a href="https://github.com/fepitre/package-rebuilder">PackageRebuilder</a> instance hosted by <a href="https://github.com/fepitre">Frédéric Pierret</a>.</p>
                <br />
                <p>This page shows the results of verification builds of official distribution packages in the repositories in an effort to be fully reproducible.
                    For more information read the <a href="https://reproducible-builds.org/">Reproducible Builds</a> website.</p>
            </div>
        </div>
    )
}

function Footer() {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <noscript>
                    <h1 class="title">Please enable javascript to use this site</h1>
                </noscript>
                <p>
                    The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a> and available <a href="https://github.com/fepitre/package-rebuilder-website">here</a>.
                </p>
            </div>
        </footer>
    )
}

function Body() {
    const project = window.location.pathname.slice(1).replace('.html', '');
    return (
        <React.Fragment>
            <Header />
            <ProjectsList />
            {project && ["qubesos", "debian"].indexOf(project) > -1 && <Project project={project} />}
            <Footer />
        </React.Fragment>
    )
}

render(
    <Body />, document.getElementById('root')
);
