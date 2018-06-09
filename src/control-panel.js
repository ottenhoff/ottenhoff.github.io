import React, {PureComponent} from 'react';

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const {settings} = this.props;

    return (
      <Container>
        <h3>NYC Opp Zones</h3>
        <div>Filter by:
          <div>-- Urban Inst Invst Score: <b>{settings.score}</b></div>
          <div>-- Median Family Income: <b>{settings.income}</b></div>
        </div>
        <hr />

        <div key={name} className="input">
          <label htmlFor="score">Score</label>
          <input id="score" type="range" value={settings.score}
            min={1} max={10} step={1}
            onChange={evt => this.props.onChange('score', evt.target.value)} />
        </div>

        <div className="input">
          <label htmlFor="income">Income</label>
          <input id="income" type="range" value={settings.income}
            min={15000} max={100000} step={5000}
            onChange={evt => this.props.onChange('income', evt.target.value)} />
        </div>
      </Container>
    );
  }
}
