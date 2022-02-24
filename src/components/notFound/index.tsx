import * as React from 'react';
import "./styles.scss";

export class PageNotFound extends React.Component {
    public render() {
        return <div className="pageNotFoundContainer">
            <h1 className='pageNotFoundLabel'>
                {`Page not found`}
            </h1>
        </div>;
    }
}