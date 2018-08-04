import React, { Component } from "react";
import axios from "axios";
import pixelSpeechBubble from "./assets/pixel-speech-bubble.png";
import "./App.css";

import Search from "./components/Search";
import Table from "./components/Table";

import { ButtonWithLoading } from "./containers";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "20";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const updateSearchTopStoriesState = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [...oldHits, ...hits];

  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page } },
    isLoading: false
  };
};

const updateDismissStoryState = id => prevState => {
  const { searchKey, results } = prevState;
  const { hits, page } = results[searchKey];

  const isNotId = item => item.objectID !== id;

  const updatedHits = hits.filter(isNotId);

  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page } }
  };
};

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    };
  }

  needToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  };

  setSearchTopStories = ({ hits, page }) => {
    this.setState(updateSearchTopStoriesState(hits, page));
  };

  onDismiss = id => {
    this.setState(updateDismissStoryState(id));
  };

  onSearchSubmit = event => {
    this.setState(prevState => {
      const { searchTerm } = prevState;
      return { searchKey: searchTerm };
    });

    const { searchTerm } = this.state;

    if (this.needToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault(); // prevent native browser reload
  };

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  };

  componentDidMount() {
    this._isMounted = true;

    this.setState(prevState => {
      const { searchTerm } = prevState;
      return { searchKey: searchTerm };
    });
    this.fetchSearchTopStories(this.state.searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { searchKey, results, searchTerm, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <img src={pixelSpeechBubble} alt="Bits Speech Bubble" />
          <h1 className="title">Snews</h1>
          <h2 className="subtitle">Bits and Bytes from the Internet</h2>

          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <section className="interactions">
            <p>Something went wrong!</p>
          </section>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <section className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            className="button-visible"
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </section>
        <footer className="interactions">
          <div>
            Pulled from <a href="https://news.ycombinator.com/">Hacker News</a>
          </div>
          <div>2018 &#169; Rebecca Song</div>
        </footer>
      </div>
    );
  }
}

export default App;
