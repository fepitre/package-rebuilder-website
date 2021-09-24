'use strict';

const React = require('react');

import Collapsible from 'react-collapsible'

function CapitalizeFirstLetter(props) {
  var string = props.value;
  return string[0].toUpperCase() + string.slice(1);
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
        let build_log_url = `/${props.project}/results/${pkg.log}`;
        let diffoscope_url = ``;
        links = <span className="noselect"> <a href={build_log_url} title="build log"><img src="icons/note-16.svg" className="icon" /></a> {pkg.has_diffoscope && <a href={diffoscope_url} title="diffoscope"><img src="icons/search-16.svg" className="icon" /></a>}</span>;
        return <li key={pkg.name}><p className="subtitle is-6"><a href={url}>{pkg.name} {pkg.version}</a>{links}</p></li>
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

class Distribution extends React.Component {
  render() {
    const { project, distribution, architectures } = this.props;
    let key = `${project}-${distribution}`;
    return (
      <section key={key} className="section pt-4 pb-4" id={key}>
        <div className="box content has-background-info2">
          <div className="content has-text-centered">
            <h2><strong>{distribution}</strong></h2>
          </div>
          {
            Object.keys(architectures).map(name =>
              <Architecture project={project} distribution={distribution} architecture={name} package_sets={architectures[name]} />
            )
          }
        </div>
      </section>
    )
  }
}

class Architecture extends React.Component {
  render() {
    const { project, distribution, architecture, package_sets } = this.props;
    let key = `${project}-${distribution}-${architecture}`;
    return (
      <section key={key} className="section pt-4 pb-4" id={key}>
        <section>
          {
            Object.keys(package_sets).map(name =>
              <img className="section pt-4 pb-4" style={{ height: '360' }} src={`/${project}/results/${distribution}_${name}.${architecture}.png`} />
            )
          }
        </section>
        {
          Object.keys(package_sets).map(name =>
            <PackageSetSection project={project} distribution={distribution} architecture={architecture} package_set={name} status={package_sets[name]} />
          )
        }
      </section>
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
    const key = `${project}-${distribution}-${architecture}-${package_set}-${architecture}`;
    return (
      <section key={key} className="section pt-4 pb-4" id={key}>
        <div className="tile box has-background-info">
          <Collapsible trigger={`${package_set} (${architecture})`} open>
            {status.reproducible && status.reproducible.length > 0 && <StatusSection label="reproducible" project={project} pkgs={status.reproducible} />}
            {status.unreproducible && status.unreproducible.length > 0 && <StatusSection label="unreproducible" project={project} pkgs={status.unreproducible} />}
            {status.failure && status.failure.length > 0 && <StatusSection label="failure" project={project} pkgs={status.failure} />}
            {status.retry && status.retry.length > 0 && <StatusSection label="retry" project={project} pkgs={status.retry} />}
            {status.pending && status.pending.length > 0 && <StatusSection label="pending" project={project} pkgs={status.pending} />}
            {status.running && status.running.length > 0 && <StatusSection label="running" project={project} pkgs={status.running} />}
          </Collapsible>
        </div>
      </section>
    )
  }
}


class Body extends React.Component {
  render() {
    const { fetchFailed, project, distributions } = this.props;
    return (
      <React.Fragment>
        {!fetchFailed && !distributions &&
          <section className="section">
            <p><b>Loading packages...</b></p>
          </section>
        }
        {fetchFailed &&
          <section className="section">
            <div className="tile box has-background-danger">
              <div className="content has-text-centered">
                <p className='title is-5 has-text-white'>An unexpected error occurred fetching the rebuild status</p>
              </div>
            </div>
          </section>
        }
        {
          Object.keys(distributions).map(name => <Distribution project={project} distribution={name} architectures={distributions[name]} />)
        }
      </React.Fragment>
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
          <section className="section">
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
