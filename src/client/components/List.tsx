import React from 'react'
import { format } from 'prettier'
import { connect } from 'react-redux'
import { getPings } from '@redux/selectors'
import Immutable from 'immutable'
import moment from 'moment'
import {loadMoreAction} from '@redux/ducks/pings'
interface IListProps {
 pings: typeof Immutable.List<any>
 loadMoreAction: typeof loadMoreAction
}
interface IListState {
  stopOn:number
}
export  class List extends React.Component<IListProps, IListState> {
  public state={
    stopOn:-1
  }
  public render() {
    return (
      <article className="message">
        <div className="message-header">List
        {this.state.stopOn===-1 ? <button onClick={this.switchPause}>pause</button>:<button  onClick={this.switchPause}>resume</button>}
        <button onClick={this.loadMore}>load more</button>
        </div>
        <div className="message-body">
          <table>
            <thead>
              <tr>
                <th>date time </th>
                <th>domain</th>
                <th>result</th>
              </tr>
            </thead>
            <tbody>
              {this.props.pings &&
                this.props.pings
                .filter(p=>(this.state.stopOn===-1 || p.get('counter')<=this.state.stopOn))

                .sort((a,b)=>a.get('counter')>b.get('counter'))
                .map(p => (
                  <tr key={p.get('counter')}>
                    <td>{moment(p.get('startTime')).format('mm:HH:ss DD-MM-YYYY')}</td>
                    <td>{p.get('host')}</td>
                    <td>{p.get('result') !== -1 ? `${p.get('result')} ms` : ';('} </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </article>
    )
  }
  private loadMore =()=>{
    const lastPing = this.props.pings.reverse().getIn([0,'counter'])
    this.props.loadMoreAction(lastPing)
  }
  private switchPause = ()=>{
    const lastPing = this.props.pings.reverse().getIn([0,'counter'])
    if(this.state.stopOn===-1) { this.setState({stopOn:lastPing}) } else {
      this.setState({stopOn:-1})
    }
  }
}
export default connect(state => ({ pings: getPings(state) }), {loadMoreAction})(List)
