import React from 'react'
import { ifStatement } from 'babel-types'
import { ifStatement } from 'babel-types'
import { connect } from 'react-redux'
import { addHostAction } from '@redux/ducks/hosts'
interface IAddHostProps {
  addHostAction: typeof addHostAction
}
interface IAddHostState {
  hostName: string
  once: boolean
}
export class AddHost extends React.Component<IAddHostProps, IAddHostState> {
  public state = {
    hostName: '',
    once: true,
  }
  public render() {
    const { hostName, once } = this.state
    return (
      <article className="message">
        <div className="message-header">AddHost</div>
        <div className="message-body">
          <form onSubmit={this.ping}>
            <label>
              {' '}
              Host: <input value={hostName} onChange={this.changeHost} />
            </label>
            <label>
              {' '}
              only once: <input checked={once} onChange={this.changeOnce} type="checkbox" />
            </label>
            <button>Ping</button>
          </form>
        </div>
      </article>
    )
  }
  private changeHost = e => {
    const value = e.target.value
    this.setState({ hostName: value })
  }
  private changeOnce = () => {
    this.setState(s => ({ once: !s.once }))
  }
  private ping = event => {
    event.preventDefault()
    this.props.addHostAction(this.state.hostName, this.state.once)
    this.setState({
      hostName: '',
    })
    return false
  }
}
export default connect(
  null,
  { addHostAction }
)(AddHost)
