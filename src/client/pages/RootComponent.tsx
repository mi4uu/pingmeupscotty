import React from 'react'
import MsgDisplay from '@components/MsgDisplay'
import ConnectionState from '@components/ConnectionState'
import AddHost from '@components/AddHost'
import Hosts from '@components/Hosts'
import List from '@components/List'
export default class RootComponent extends React.Component<any, any> {
  public render() {
    return (
      <div className="container">
        <MsgDisplay />
        <ConnectionState />
        <AddHost />
        <Hosts />
        <List />
      </div>
    )
  }
}
