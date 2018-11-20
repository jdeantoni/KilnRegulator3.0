import React from 'react';
import { FlatList } from 'react-native';
import ProgramItem from "../components/ProgramItem";

export default class ProgramList extends React.Component {
    render() {
        return (
            <FlatList
                data={[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <ProgramItem program={{item}}/>}
            />
        );
    }
}
