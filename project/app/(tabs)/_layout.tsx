import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';

function TabBarIcon({ 
  name, 
  label, 
  focused 
}: { 
  name: React.ComponentProps<typeof Ionicons>['name']; 
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons 
        name={name} 
        size={24} 
        color={focused ? '#3498db' : '#95a5a6'} 
      />
      <Text style={[
        styles.tabLabel,
        { color: focused ? '#3498db' : '#95a5a6' }
      ]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" label="Accueil" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Repas',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="restaurant" label="Repas" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activités',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="fitness" label="Activités" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="person" label="Profil" focused={focused} />
          ),
          headerRight: () => null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});