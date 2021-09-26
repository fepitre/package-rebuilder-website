'use strict';

const React = require('react');

import Collapsible from 'react-collapsible'

function CapitalizeFirstLetter(props) {
  var string = props.value;
  return string[0].toUpperCase() + string.slice(1);
}

function CapitalizeProject(props) {
  var project = props.project;
  if (project == "debian") {
    return "Debian";
  } else if (project == "qubesos") {
    return "Qubes OS";
  } else {
    return project;
  }
}

function StatusSection(props) {
  const isOpen = props.open;
  const content = (
    <ul>
      {props.pkgs.map(function (pkg) {
        // fixme: this is not working because it misses
        // let url = `https://snapshot.notset.fr/mr/package/${pkg.name}/${pkg.version}/srcfiles?fileinfo=1`;
        let url = '';
        if (props.project == "debian") {
          url = `https://tracker.debian.org/pkg/${pkg.name}`;
        } else if (props.project == "qubesos") {
          url = `https://snapshot.notset.fr/mr/package/${pkg.name}`;
        }
        let links = '';
        let build_log_url = `${pkg.log}`.replace('/rebuild', '');
        let metadata_url = `${pkg.metadata}`.replace('/rebuild', '');
        let diffoscope_url = ``;
        links = <span className="noselect"> {pkg.metadata && <a href={metadata_url} title="in-toto metadata"><img src="icons/in-toto-16.svg" className="icon" /></a>} {pkg.log && <a href={build_log_url} title="build log"><img src="icons/note-16.svg" className="icon" /></a>} {pkg.has_diffoscope && <a href={diffoscope_url} title="diffoscope"><img src="icons/search-16.svg" className="icon" /></a>}</span>;
        return <li key={Math.random()}><p className="subtitle is-6"><a href={url}>{pkg.name} {pkg.version}</a>{links}</p></li>
      })}
    </ul>
  );
  const label = `${props.label} (${props.pkgs.length})`;
  return (
    <div className={props.label}>
      {isOpen
        ? <Collapsible trigger={label} lazyRender open>{content}</Collapsible>
        : <Collapsible trigger={label} lazyRender>{content}</Collapsible>
      }
    </div>
  );
}

class Body extends React.Component {
  render() {
    const { fetchFailed, project, distributions } = this.props;
    return (
      <React.Fragment>
        {
          <section className="section pl-8 pr-8 pt-4 pb-4">
            <br /><br />
            <div className="box content has-background-info2">
              <div className="content has-text-centered title is-3">
                {/* Main project title */}
                <h2><strong><CapitalizeProject project={project} /></strong></h2>
              </div>
              {!fetchFailed && !distributions &&
                <section className="section pl-8 pr-8 pt-4 pb-4">
                  <p><b>Loading packages...</b></p>
                </section>
              }
              {fetchFailed &&
                <section className="section pl-8 pr-8 pt-4 pb-4">
                  <div className="tile box has-background-danger">
                    <div className="content has-text-centered">
                      <p className='title is-5 has-text-white'>An unexpected error occurred fetching the rebuild status</p>
                    </div>
                  </div>
                </section>
              }
              {/* Add list of links to sections */}
              {
                Object.keys(distributions).map(distribution =>
                  <div key={`${project}-${distribution}-summary`}>
                    {
                      Object.keys(distributions[distribution]).map(architecture =>
                        <div key={`${project}-${distribution}-${architecture}-link`}>
                          <p><a href={`#${project}-${distribution}-${architecture}`}>
                            <CapitalizeProject project={project} /> {distribution} ({architecture})
                          </a></p>
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          </section>
        }
        {
          Object.keys(distributions).map(distribution =>
            <div key={`${project}-${distribution}`} className="section pl-8 pr-8 pt-4 pb-4" id={`${project}-${distribution}`}>
              <div className="box content has-background-info2">
                {/* Create box per project distributions */}
                {
                  Object.keys(distributions[distribution]).map(architecture =>
                    <section key={`${project}-${distribution}-${architecture}`} className="section pl-1 pr-1 pt-4 pb-4" id={`${project}-${distribution}-${architecture}`}>
                      {/* Create packages set status section per architecture */}
                      <div className="content has-text-centered title is-4">
                        <h2>{distribution} ({architecture})</h2>
                      </div>
                      {/* Include all pie charts available for every package sets */}
                      <div className="panel">
                        <ul>
                          {
                            Object.keys(distributions[distribution][architecture]).map(name =>
                              <div key={`${project}-${distribution}-${architecture}-${name}-img`}>
                                <li>
                                  <img
                                    key={`${project}-${distribution}-${architecture}-${name}-img`}
                                    className="section pl-1 pr-1 pt-4 pb-4"
                                    src={`/${project}/results/${distribution}_${name}.${architecture}.png`}
                                  />
                                </li>
                              </div>
                            )
                          }
                        </ul>
                      </div>
                      {/* Status section per package set */}
                      {
                        Object.keys(distributions[distribution][architecture]).map(name =>
                          <div key={`${project}-${distribution}-${architecture}-${name}`}>
                            <PackageSetSection
                              project={project}
                              distribution={distribution}
                              architecture={architecture}
                              package_set={name}
                              status={distributions[distribution][architecture][name]}
                            />
                          </div>
                        )
                      }
                    </section>
                  )
                }
              </div>
            </div>
          )
        }
      </React.Fragment>
    )
  }
}


class PackageSetSection extends React.Component {
  render() {
    const { project, distribution, architecture, package_set, status } = this.props;
    const known_status = ['reproducible', 'unreproducible', 'failure', 'retry', 'pending', 'running'];
    let total = 0;
    for (let s of known_status) {
      if (s in status) {
        total += status[s].length
      }
    }
    let key = `${project}-${distribution}-${architecture}-${package_set}`;
    return (
      <section key={key} id={key} className="section pl-1 pr-1 pt-4 pb-4">
        <div className="tile box has-background-info">
          <Collapsible trigger={`${package_set} (${architecture})`} open>
            {status.reproducible && status.reproducible.length > 0 && <StatusSection label="reproducible" project={project} pkgs={status.reproducible} />}
            {status.unreproducible && status.unreproducible.length > 0 && <StatusSection label="unreproducible" project={project} pkgs={status.unreproducible} />}
            {status.failure && status.failure.length > 0 && <StatusSection label="failure" project={project} pkgs={status.failure} open/>}
            {status.retry && status.retry.length > 0 && <StatusSection label="retry" project={project} pkgs={status.retry} open/>}
            {status.running && status.running.length > 0 && <StatusSection label="running" project={project} pkgs={status.running} />}
            {status.pending && status.pending.length > 0 && <StatusSection label="pending" project={project} pkgs={status.pending} />}
          </Collapsible>
        </div>
      </section>
    )
  }
}


class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchFailed: false,
      isLoaded: false,
      project: props.project,
      distributions: {}
    };
  }

  componentDidMount() {
    const url = `/${this.state.project}/results/${this.state.project}.json`;

    fetch(url).then((response) => {
      if (!response.ok) {
        this.setState({ fetchFailed: true, isLoaded: true });
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data) => {
      this.setState({ distributions: data, isLoaded: true });
    }).catch((error) => {
      console.log(error);
      this.setState({ fetchFailed: true });
    });
  }

  render() {
    const { fetchFailed, isLoaded, project, distributions } = this.state;
    if (!isLoaded) {
      return (
        <React.Fragment>
          <section className="section pl-8 pr-8 pt-4 pb-4">
            <div className="tile box has-background-info2">
              <div className="content has-text-centered">
                <p>Loading packages...</p>
              </div>
            </div>
          </section>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Body fetchFailed={fetchFailed} project={project} distributions={distributions} />
        </React.Fragment>
      );
    }
  }
}

module.exports = { Project };
