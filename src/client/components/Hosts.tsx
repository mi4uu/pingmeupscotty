import React from 'react'
import { connect } from 'react-redux'
import { getHosts } from '@redux/selectors'
import Immutable from 'immutable'
interface IHostsProps {
  hosts: typeof Immutable.List<string>
}
export class Hosts extends React.Component<IHostsProps, null> {

  public render() {
    return (
      <article className="message">
        <div className="message-header">Hosts</div>
        <div className="message-body">
          {this.props.hosts && this.props.hosts.map(host => (
            <div className="host" key={host}>{host}</div>
          ))}
        </div>
      </article>
    )
  }
}
export default connect(state => ({ hosts: getHosts(state) }))(Hosts)
