// Libs & utils
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// CSS
import './BrowsePage.css';

// Constants
import { initialVideoQuery } from '../../../core/constants';

// Actions
import { appActions } from '../../../redux/app';
import { userActions } from '../../../redux/user';
import { videoListActions } from '../../../redux/videoList';

// Components
import PageHeader from '../../components/pageHeader/PageHeader';
import VideoList from '../../components/videoList/VideoList';
import SearchBar from '../../components/searchBar/SearchBar';
class BrowsePage extends Component {
  static propTypes = {
    isFetchingVideos: PropTypes.bool.isRequired,
    youtubeVideos: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    navigateToPath: PropTypes.func.isRequired,
    disconnectFromAllParties: PropTypes.func.isRequired,
    loadYoutubeVideos: PropTypes.func.isRequired,
    handleVideoSelection: PropTypes.func.isRequired
  };

  componentDidMount() {
    // Load an initial set of movies from Youtube into Redux store
    this.props.loadYoutubeVideos(
      initialVideoQuery.query,
      initialVideoQuery.videoType
    );

    // Disconnect from any parties the user was still connected to
    // this.props.disconnectFromAllParties();
  }

  render() {
    const {
      user,
      isFetchingVideos,
      youtubeVideos,
      handleVideoSelection
    } = this.props;

    return (
      <div className="browse-page">
        <PageHeader
          titleLeader="Hi"
          titleMain={user.userName}
          titleAfter={'Watch any Youtube video in sync together with your friends!'}
        />
        <SearchBar
          search={{ expanded: true }}
          handleSearch={this.props.loadYoutubeVideos}
        />
        <div className="g-row">
          <VideoList
            showLoadingAnimation={isFetchingVideos}
            youtubeVideos={youtubeVideos}
            handleVideoSelection={handleVideoSelection}
          />
        </div>
      </div>
    );
  }
}

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = (state) => {
  return {
    isFetchingVideos: state.videoList.isFetching,
    youtubeVideos: state.videoList.youtubeVideos,
    user: state.user
  };
};

const mapDispatchToProps = {
  navigateToPath: appActions.navigateToPath,
  disconnectFromAllParties: userActions.disconnectFromAllParties,
  loadYoutubeVideos: videoListActions.loadYoutubeVideos,
  handleVideoSelection: videoListActions.handleVideoSelection
};

BrowsePage = connect(mapStateToProps, mapDispatchToProps)(BrowsePage);

export default BrowsePage;
