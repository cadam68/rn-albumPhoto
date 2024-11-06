import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HeaderRight = () => {
    const navigation = useNavigation();

    return (
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="gear" style={{ marginRight: 10 }} size={20} color="white" />
      </TouchableOpacity>
    );
};

export default HeaderRight;
