import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import Profile from "../pages/ProfileSection/profile/Profile";
import CustomDrawer from "./CustomDrawer";
import styles from "./TabNavigatorStyle";
import Chat from "../pages/Chat/Chat";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("HomeTab");
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    scrollViewRef.current.scrollTo({ x: width, animated: false });
  }, [width]);

  const handleScroll = ({ nativeEvent }) => {
    const contentOffsetX = nativeEvent.contentOffset.x;
    const contentWidth = nativeEvent.contentSize.width;
    const windowWidth = Dimensions.get("window").width;

    if (contentOffsetX >= contentWidth - windowWidth) {
      scrollViewRef.current.scrollTo({ x: windowWidth, animated: false });
    }
    if (contentOffsetX <= 0) {
      scrollViewRef.current.scrollTo({
        x: contentWidth - 2 * windowWidth,
        animated: false,
      });
    }
  };

  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
    const tabIndex = menuItems.findIndex((item) => item.name === tabName);
    const scrollToX = tabIndex * width;
    scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const menuItems = [
    { name: "HomeTab", icon: "home", action: () => navigateToTab("HomeTab") },
    {
      name: "Contact",
      icon: "address-book",
      action: () => navigateToTab("Contact"),
    },
    { name: "Drawer", icon: "arrow-up", action: toggleDrawer },
    {
      name: "ProfileTab",
      icon: "user",
      action: () => navigateToTab("ProfileTab"),
    },
    { name: "Chat", icon: "comments", action: () => navigateToTab("Chat") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#0E1331" }}>
      {/* Conteneur du TabNavigator */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator screenOptions={{ tabBarStyle: { display: "none" } }}>
          <Tab.Screen
            name="HomeTab"
            component={Home}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Contact"
            component={Contact}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>

      {/* Menu circulaire en bas */}
      <View style={styles.menuContainer}>
        <ScrollView
          horizontal
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.circularMenuScrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          pagingEnabled
        >
          {menuItems.map((item, index) => {
            const isActive = activeTab === item.name;
            return (
              <TouchableOpacity
                key={index}
                style={isActive ? styles.centralButton : styles.circularButton}
                onPress={item.action}
              >
                <FontAwesome5
                  name={item.icon}
                  size={isActive ? 28 : 24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Drawer pour le menu personnalisé */}
      <CustomDrawer isVisible={drawerVisible} onClose={toggleDrawer} />
    </View>
  );
};

export default TabNavigator;
