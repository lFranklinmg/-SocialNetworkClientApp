import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard() {

    const{activityStore} = useStore();
    const {loadActivities, activityRegistry, setPagingParams, pagination} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext(){
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if(activityRegistry.size <= 1) loadActivities();
    },[loadActivities, activityRegistry.size])
    
      //if (activityStore.loadingInitial && !loadingNext) return <LoadingComponent content='...Loading Dashboard' inverted={false} />

    return (
        <Grid>
            <Grid.Column width={'10'}>
                {activityStore.loadingInitial && activityRegistry.size === 0 && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ):(
                    <InfiniteScroll 
                        pageStart={0} 
                        loadMore={handleGetNext} 
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
              
            </Grid.Column>
            <Grid.Column width='6'>
              <h4><ActivityFilters/></h4>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>
    )
}) 