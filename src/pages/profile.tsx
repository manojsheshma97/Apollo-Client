import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Loading, Header, LaunchTile } from '../components';
import { LAUNCH_TILE_DATA } from './launches';
import { RouteComponentProps } from '@reach/router';
import * as GetMyTripsTypes from './__generated__/GetMyTrips';
import { Doughnut } from 'react-chartjs-2';

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;





interface ProfileProps extends RouteComponentProps { }

const Profile: React.FC<ProfileProps> = () => {
  const {
    data,
    loading,
    error
  } = useQuery<GetMyTripsTypes.GetMyTrips>(
    GET_MY_TRIPS,

    { fetchPolicy: "network-only" }
  );
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (data === undefined) return <p>ERROR</p>;
  let state = {
    labels: [''],
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: [ '#B21F00',
        '#C9DE00',
        '#2FDE00',
        '#00A6B4',
        '#6800B4'],
        data: [0]
      }
    ]
  }

  let arr: any[] = []
  //let backcolor: any[] = []
  let myData: number[]=[]
  //var rr
  return (
    <Fragment>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (

        data.me.trips.map((launch: any) => (
          // eslint-disable-next-line no-sequences
          //arr = arr.concat([launch.mission.name]),
          <LaunchTile key={launch.id} launch={launch} />
        ))
      ) : (
        <p>You haven't booked any trips</p>
      )}


      {data.me && data.me.trips.length ? (

        data.me.trips.map((launch: any) => (
          // eslint-disable-next-line no-sequences
          arr = arr.concat([launch.mission.name]),
          myData=myData.concat([1])
          //rr=Math.floor(Math.random()*56777215).toString(16),
         // backcolor=backcolor.concat([rr])
        )),
        state["labels"]=arr,
        state["datasets"][0]["data"]=myData
        //state["datasets"][0]["backgroundColor"]=backcolor
      ) : (
        <p></p>
      )}
      

      <Fragment>
        <Doughnut
          type="doughnut"
          data={state}
          options={{
            title: {
              display: true,
              text: 'Average Rainfall per month',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            }
          }}
        /></Fragment>
    </Fragment>
  );
}

export default Profile;
