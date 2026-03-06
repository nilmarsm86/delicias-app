import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const FilterTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}
          >
            {tab.icon} {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 5,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FF6B6B",
  },
  tabText: {
    fontSize: 12,
    color: "#2C3E50",
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FilterTabs;
