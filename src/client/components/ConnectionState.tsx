import React from 'react'
import { connect } from 'react-redux'
import { isOnline } from '@redux/selectors'
interface IConnectionStateProps {
  isOnline: boolean
}
export class ConnectionState extends React.Component<IConnectionStateProps, null> {
  public render() {
    return (
      <article className="message">
        <div className="message-header">ConnectionState</div>
        <div className="message-body">
          {this.props.isOnline ? (
            <div className="connected">Connected</div>
          ) : (
            <div className="disconnected">Disconnected</div>
          )}
        </div>
      </article>
    )
  }
}
export default connect(state => ({ isOnline: isOnline(state) }))(ConnectionState)
