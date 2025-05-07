import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../screen/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';



const Menu = ({ navigation }) => {
    const { user } = useAuth(); // ดึง user จาก AuthContext
    const [username, setUsername] = useState("User"); // ตั้งค่าเริ่มต้นเป็น "User"
    useEffect(() => {
        const fetchUsername = async () => {
            if (user) {
                try {
                    const db = getFirestore();
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username || "User");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUsername();
    }, [user]);
    const menuItems = [
        {
            icon: 'user',
            title: 'Edit Profile',
            onPress: () => navigation.navigate('EditProfile')
        },
        {
            icon: 'heart',
            title: 'Favorites',
            onPress: () => navigation.navigate('Favorites')
        },
        {
            icon: 'globe',
            title: 'Change Language',
            onPress: () => navigation.navigate('LanguageSettings')
        },
        {
            icon: 'help-circle',
            title: 'Help Center',
            onPress: () => navigation.navigate('HelpCenter')
        }
    ];

    // const handleLogout = () => {
    //     // Implement logout logic here
    //     // This might involve:
    //     // - Clearing user token
    //     // - Resetting navigation state
    //     // - Navigating to login screen
    //     navigation.navigate('Login');
    // };

    // const handleDeleteAccount = () => {
    //     // Implement account deletion logic here
    //     // Show confirmation dialog
    //     // Remove user data
    //     // Navigate to login or welcome screen
    //     navigation.navigate('Login');
    // };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Feather name="chevron-left" size={40} color="#ffff" />
            </TouchableOpacity>

            <Image
                source={require('../assets/logo-removebg.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.userGreeting}>
                <Text style={styles.greeting}>Hello, {username}</Text>
            </View>

            <View style={styles.menuCard}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <View style={styles.menuItemContent}>
                            <Feather
                                name={item.icon}
                                size={20}
                                color="#014737"
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </View>
                        <Feather
                            name="chevron-right"
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    
                >
                    <Feather
                        name="log-out"
                        size={20}
                        color="#fff"
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteAccountButton}
                    onPress={handleDeleteAccount}
                >
                    <Feather
                        name="trash-2"
                        size={20}
                        color="#FF0000"
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#014737',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        top:'40'
    },
    logo: {
        width: 190, 
        height: 120, 
        alignSelf: 'center',
        bottom:'40' 
    },
    title: {
        color: '#FDCB02',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 20,
    },
    userGreeting: {
        marginBottom: 20,
    },
    greeting: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        padding:'10'
    },
    menuCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 15,
    },
    menuItemText: {
        fontSize: 16,
        color: '#014737',
    },
    actionButtons: {
        marginTop: 20,
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    deleteAccountButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: 'white',
        paddingVertical: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    buttonIcon: {
        marginRight: 10,
    },
    logoutButtonText: {
        color: '#ffff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteAccountButtonText: {
        color: '#FF0000',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Menu;