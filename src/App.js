import React, { Component } from 'react';
// import logo from './logo.svg';
import axios from 'axios';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import pixelSpeechBubble from './assets/pixel-speech-bubble.png';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
}

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
      
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] 
    ? results[searchKey].hits 
    : [];
  
  const updatedHits = [...oldHits, ...hits];

  return {
    results : { ...results, [searchKey] : { hits : updatedHits, page }},
    isLoading: false
  };
}

const updateDismissStoryState = id => prevState => {
  const { searchKey, results } = prevState;
  const { hits, page } = results[searchKey];

  const isNotId = item => item.objectID !== id;
  
  const updatedHits = hits.filter(isNotId);

  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page}}
  };
}

class App extends Component {

  _isMounted = false;
  
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }
  
  onDismiss(id) {
    this.setState(updateDismissStoryState(id));
  }
  
  onSearchSubmit(event) {
    this.setState(prevState => {
      const { searchTerm } = prevState;
      return { searchKey: searchTerm };
    });

    if (this.needsToSearchTopStories(this.state.searchTerm)) {
      this.fetchSearchTopStories(this.state.searchTerm);
    }

    event.preventDefault(); // prevent native browser reload
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    // Native Fetch API
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    // .then(response => response.json()) 
    
    this.setState({ isLoading: true });
    // Axios
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => this._isMounted && this.setSearchTopStories(result.data))
    .catch(error => this._isMounted && this.setState({ error }));
    
  }
  
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
    
    const { 
      searchKey, 
      results,
      searchTerm, 
      error, 
      isLoading
    } = this.state;
    
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

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
        {
          error  
            ? <section className="interactions"><p>Something went wrong!</p></section>
            : <Table
                list={list}
                onDismiss={this.onDismiss}
              />
        }
        <section className="interactions">
          <ButtonWithLoading 
            isLoading={isLoading} 
            className="button-visible"
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </section>
        <footer className="interactions">
          <div>Pulled from <a href="https://news.ycombinator.com/">Hacker News</a></div>
          <div>2018 &#169; Rebecca Song</div>
        </footer>
      </div>
    );
  }
}

// ---- Functional Stateless Component (FSC)
// function Search(props) { 
//   const {value, onChange, children} = this.props;

// ---- Destructured Props in FSC Method Signature
// const Search = ({value, onChange, onSubmit, children}) =>
//   <form onSubmit={onSubmit}>
//     <input
//       type="text"
//       value={value}
//       onChange={onChange} 
//     />
//     <button type="submit">{children}</button>
//   </form>
  
// ---- ES 6 Class
  class Search extends Component {
    
    componentDidMount() {
      if (this.input) {
        this.input.focus();
      }
    }
    
    render() {
      const {
        value,
        onChange,
        onSubmit,
        children
      } = this.props;

      return (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={value}
            onChange={onChange} 
            ref={(node) => { this.input = node; }}
          />
          <button type="submit" className="button-visible">{children}</button>
        </form>
      );
    }
  }

  Search.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };


// const Table = ({ list, onDismiss, onSort, sortKey, isSortReverse }) =>
class Table extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {

    const {
      list,
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      
      <div className="table">
        <div className="table-header">
          <span style={{ width: '50%' }}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: '20%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
              >
              Author
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
              >
              Comments
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
              >
              Points
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            Archive
          </span>
        </div>

        {
          reverseSortedList.map(item => 
            <div key={item.objectID} className="table-row">
              <span style={{ width: '50%' }}><a href={item.url}>{item.title}</a></span>
              <span style={{ width: '20%' }}>{item.author}</span>
              <span style={{ width: '10%' }}>{item.num_comments}</span>
              <span style={{ width: '10%' }}>{item.points}</span>
              <span style={{ width: '10%' }}>
                <Button
                  className="button-inline dismiss-btn"
                  onClick={() => onDismiss(item.objectID)}
                  >
                  Dismiss
                </Button>
              </span>
            </div>
          )
        }
      </div>
    )
  };
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.num,
      points: PropTypes.num
    })
  ),
  onDismiss: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  sortKey: PropTypes.string,
  isSortReverse: PropTypes.bool
};

const Button = ({ onClick, className = '', children }) =>
  <button 
    type="button"
    onClick={onClick}
    className={className}
  >
    {children}
    </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

const Loading = () =>
  <div><i className="fa fa-spinner fa-spin"></i></div>

// HOC Sample - Prepend "with"  
// Conditional Rendering is a good use case for HOCs
// -- 'rest' destructuring
const withLoading = (Component) => ({ isLoading, ...rest }) => 
  isLoading 
    ? <Loading />
    : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {

  // Without classnames library -------
  // const sortClass = ['button-inline'];

  // if (sortKey === activeSortKey) {
  //   sortClass.push('button-active');
  // }

  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button 
      className={sortClass}
      onClick={() => onSort(sortKey)}>
      {children}
      {
        activeSortKey !== 'NONE' 
        ? sortKey === activeSortKey 
          ? isSortReverse 
            ? <i className="fa fa-caret-up sort-icon"></i>
            : <i className="fa fa-caret-down sort-icon"></i>
          : null 
        : null  
      }
    </Button>
  );
}

export default App;

export {
  Button,
  Search,
  Table
};
