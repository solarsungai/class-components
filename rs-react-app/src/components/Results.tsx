import { PureComponent } from 'react';

type ResultsProps = {
  results: string[];
};

class Results extends PureComponent<ResultsProps> {
    render() {
        console.log("results");
        return (
            <div className="results">
                {this.props.results.map((result, index) => (
                    <div key={index} className="result-item">{result}</div>
                ))}
            </div>
        );
    }
}

export default Results;