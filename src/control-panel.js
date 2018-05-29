import React, {PureComponent} from 'react';

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const {settings} = this.props;

    return (
      <Container>
        <h3>NYC Opp Zones</h3>
        <p>Filter by Urban Inst Score <b>{settings.score}</b>.</p>
        <hr />

        <div key={name} className="input">
          <label>Score</label>
          <input type="range" value={settings.score}
            min={1} max={10} step={1}
            onChange={evt => this.props.onChange('score', evt.target.value)} />
        </div>
      </Container>
    );
  }
}
