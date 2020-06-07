/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Dimensions,
	FlatList,
	RefreshControl,
	RefreshControlBase
} from 'react-native';

import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';

const alpha = require('alphavantage')({ key: '#YOURAPIKEY' });

class App extends React.Component {
	state = {
		stocks: [],
		indices: [ 'BBRI','BBCA','BBNI' ],
		refreshing: true
	};
	getStocksData = async () => {
		let stocks = [];

		for (const index of this.state.indices) {
			let temp = {};

			temp = await alpha.data.intraday(index + '.JK', 'full', null, '60min');

			let timeSeriesStocks = temp['Time Series (60min)'];

			temp = {};
			temp['index'] = index;
			temp['label'] = [];
			temp['data'] = [];

			let i = 0;

			let x = Object.keys(timeSeriesStocks).length / 4;
			let labels = Object.keys(timeSeriesStocks).reverse();
			var dateNow = moment();

			labels = labels.filter((label) => {
				var oneMonthBeforeLimit = moment(dateNow).subtract(1, 'M');
				return moment(label).month() >= oneMonthBeforeLimit.month();
			});

			labels.forEach((label) => {
				let date = moment(label).utcOffset('-0500').format('YYYY-MM-DD HH:mm');

				let newLabel = i == 0 || i == labels.length - 30 ? date : '';
				temp['label'].push(newLabel);
				temp['data'].push(parseFloat(timeSeriesStocks[label]['4. close']));
				i += 1;
			});

			stocks.push(temp);
		}

		this.setState({ stocks: stocks, refreshing: false });
	};

	componentDidMount() {
		this.getStocksData();
	}

	onRefresh() {
		// this.getStocksData()
	}

	render() {
		return (
			<View>
				<FlatList
					data={this.state.stocks}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
							colors={[ '#6fb243' ]}
						/>
					}
					initialNumToRender={1}
					renderItem={({ item: stock }) => {

						return (
							<View style={{ padding: 15 }}>
								<Text style={{ fontSize: 30, paddingLeft: 5 }}>{stock['index']}</Text>
								<LineChart
									data={{
										labels: stock ? stock['label'] : [ '0', '0', '0' ],
										datasets: [
											{
												data: stock ? stock['data'] : [ 0, 0, 0 ]
											}
										]
									}}
									width={Dimensions.get('window').width - 20} // from react-native
									height={220}
									yAxisInterval={1} // optional, defaults to 1
									chartConfig={{
										backgroundColor: '#e26a00',
										backgroundGradientFrom: '#fb8c00',
										backgroundGradientTo: '#ffa726',
										decimalPlaces: 2, // optional, defaults to 2dp
										color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
										labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
										propsForDots: {
											r: '0',
											strokeWidth: '0',
											stroke: '#ffa726'
										},
										propsForBackgroundLines: {
											strokeWidth: '0'
										}
									}}
									bezier
									style={{
										margin: 5,
										borderRadius: 10
									}}
								/>
							</View>
						);
					}}
					keyExtractor={(item)=>item['index']}
					onEndReachedThreshold={0.2}
					contentContainerStyle={{ paddingBottom: 1 }}
				/>
			</View>
		);
	}
}

export default App;
