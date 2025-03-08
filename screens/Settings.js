import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Settings = ({ navigation }) => {
    const handleLogout = () => {
        navigation.reset({
            index: 0,  
            routes: [{ name: 'login' }],
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Settings Screen</Text>
            
            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
                <Text style={{ color: 'red' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;
