/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
import ChartComponent from './src/ChartComponent';
import NewsComponent from './src/NewsComponent';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Tab = createMaterialBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator>
				<Tab.Screen
					name="Chart"
					component={ChartComponent}
					options={{
						tabBarLabel: 'Chart',
						tabBarIcon: ({ color }) => <FontAwesome name="line-chart" color={color} size={20} />
					}}
				/>
				<Tab.Screen
					name="News"
					component={NewsComponent}
					options={{
						tabBarLabel: 'News',
						tabBarIcon: ({ color }) => <FontAwesome name="newspaper-o" color={color} size={20} />
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}
