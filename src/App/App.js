import React, { Component } from 'react';
import { Grid,Row, Col, Panel, Image, Alert, Button  } from 'react-bootstrap';
import axios from 'axios'
import Pagination from 'react-js-pagination'
import Loading from 'react-loading-spinner'
import Spinner from './spinner'

import './App.css';

const INITIAL_STATE = {
    tvshows: [],
    showloader: true,
    numberofpage: 1,
    activePage: 1,
    totalItems: 0,
    showError:false
};

const API_KEY = '9b6b753c7b84c795b789e422ffdc7883';
const URL = 'https://api.themoviedb.org/4/tv';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentDidMount(){
        let page = this.state.numberofpage;
        this.getTvShow(page);
    }

    getTvShow(page){
        axios.get( URL + '/popular?api_key='+ API_KEY + '&language=en-US&page=' + page)
            .then((response) =>{
                let tvshows = response.data.results;
                let totalItems  = response.data.total_results;
                this.setState({
                    tvshows,
                    showloader:false,
                    totalItems,
                    showError:false
                });

            })
            .catch((error) =>{
                console.log(error);
                this.setState({
                    showloader:false,
                    showError:true
                });
            });
    }

    _renderTvShow = () =>{
        return(
            this.state.tvshows.map((tvshow, i) =>(
                <Col sm ={6}  md={6} lg={3} key={i}>
                    <Panel
                        key={i}
                        header={tvshow.name}
                        bsStyle="primary"
                        style={{width: '100%'}}
                    >
                        { tvshow.backdrop_path === null
                            ? <Image src='http://via.placeholder.com/500x281' responsive />
                            : <Image src={'https://image.tmdb.org/t/p/w500/' + tvshow.backdrop_path} responsive />
                        }
                        <div
                            style={{
                             maxHeight: '70px',
                            textAlign: 'justify',
                            marginBottom: '5px',
                            marginTop: '1px',
                            height: '70px'}}>
                            {(tvshow.overview).substr(0,100)}...</div>
                        <div
                            style={{
                                 height: '20px',
                                 marginTop: '15px',
                                 backgroundColor: 'rgba(49, 118, 177, 0.75)',
                                color: 'white'
                            }}
                        >
                            Popularity: {tvshow.popularity}
                        </div>
                    </Panel>
                </Col>
            ))
        )
    };

    handlePageChange = (pageNumber) => {
        this.setState({showloader:true});
        this.setState({activePage: pageNumber});
        this.getTvShow(pageNumber);
    };

    handleAlertDismiss = () =>{
        this.getTvShow(this.state.activePage);
        this.setState({showError: false});
    };

    _renderPagination = () => {
        return(
            <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={20}
                totalItemsCount={this.state.totalItems-20}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
            />
        )
    };

    render() {
        return (
            <div className="App">
                <Grid>
                    <Loading isLoading={this.state.showloader}
                             loadingClassName='loading'
                             spinner={Spinner}>
                        <Row className="show-grid">
                            <div>
                                {this.state.tvshows.length  > 0 ?
                                    <div>
                                        {this._renderPagination()}
                                    </div>
                                    : null
                                }
                            </div>
                            <div>
                                {this.state.showError &&
                                <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                                    <h4>Oh snap! You got an error!</h4>
                                    <p>Error getting information</p>
                                    <p>
                                        <Button onClick={this.handleAlertDismiss}>Try Again.</Button>
                                    </p>
                                </Alert>
                                }
                            </div>
                        </Row>
                        <Row className="show-grid">
                            {this._renderTvShow()}
                        </Row>
                        <div>
                            {this.state.tvshows.length  > 0 ?
                                <div>
                                    {this._renderPagination()}
                                </div>
                                : null
                            }
                        </div>
                    </Loading>
                </Grid>
            </div>
        );
    }
}

export default App;
