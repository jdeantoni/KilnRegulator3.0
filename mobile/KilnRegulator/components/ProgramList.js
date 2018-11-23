import React from 'react';
import { FlatList } from 'react-native';
import ProgramItem from "../components/ProgramItem";

export default class ProgramList extends React.Component {
    render() {
        return (
            <FlatList
                data={this.props.programs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <ProgramItem program={{item}}/>}
            />
        );
    }
}
