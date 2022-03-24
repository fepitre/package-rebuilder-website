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
                    <a href="/debian_bullseye.html">
                        <h2>Debian Bullseye</h2>
                        <img width="50" src="/images/debian-nd.svg" />
                    </a>
                </div>
                <div className="section pt-4 pb-4">
                    <a href="/debian_bookworm.html">
                        <h2>Debian Bookworm</h2>
                        <img width="50" src="/images/debian-nd.svg" />
                    </a>
                </div>
                <div className="section pt-4 pb-4">
                    <a href="/debian_sid.html">
                        <h2>Debian Sid</h2>
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
                    For more information read the <a href="https://reproducible-builds.org/">Reproducible Builds</a> website and the announcement <a href="https://www.qubes-os.org/news/2021/10/08/reproducible-builds-for-debian-a-big-step-forward/">Reproducible builds for Debian: a big step forward</a>.</p>
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
    const fullproject = window.location.pathname.slice(1).replace('.html', '');
    const split_fullproject = fullproject.split('_');
    var project = "";
    var dist = "";
    if (split_fullproject.length>1) {
        project = split_fullproject[0];
        dist = split_fullproject[1];
    }
    return (
        <React.Fragment>
            <Header />
            <ProjectsList />
            {project && ["qubesos", "debian", "debian", "debian"].indexOf(project) > -1 && <Project project={project} dist={dist} />}
            <Footer />
        </React.Fragment>
    )
}

render(
    <Body />, document.getElementById('root')
);
