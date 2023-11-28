import react from 'react';
import { StyleSheet, Image, View, Button, Text } from 'react-native';

const Nested = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text>Nested Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    margin: {
        height: 10,
    },
});

export default Nested;
