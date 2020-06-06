/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Dimensions } from 'react-native';

import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';

const alpha = require('alphavantage')({ key: 'MH4AW8511HB7KXGX' });

const chartConfig = {
	backgroundGradientFrom: '#1E2923',
	backgroundGradientFromOpacity: 0,
	backgroundGradientTo: '#08130D',
	backgroundGradientToOpacity: 0.5,
	color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
	strokeWidth: 2, // optional, default 3
	barPercentage: 0.5,
	useShadowColorFromDataset: false // optional
};

class App extends React.Component {
	state = {
		stocks: {}
	};
	getStocksData = async () => {
		let stocks = {};
		let temp = {};

    temp = await alpha.data.intraday(`BBRI.JK`, "full", null, '5min');
    
		let timeSeriesStocks = temp['Time Series (5min)'];
    console.warn(timeSeriesStocks);
    
		temp = {};
		temp['label'] = [];
		temp['data'] = [];

    let i = 0;
    
    let x = Object.keys(timeSeriesStocks).length/4
    let labels = Object.keys(timeSeriesStocks).reverse()
    

    
    

    labels.forEach(label => {
      let date = moment(label)
			let hour = date.hour() + ':00';
      
			let newLabel =  '';
  		temp['label'].push(newLabel);
			temp['data'].push(parseFloat(timeSeriesStocks[label]['4. close']));        
      i += 1;
      

    });

		stocks['BBRI'] = temp;

		this.setState({ stocks: stocks });
	};

	componentDidMount() {
    
    this.getStocksData();
	}

	render() {
		return (
			<View>
				<LineChart
					data={{
						labels: this.state.stocks['BBRI'] ? this.state.stocks['BBRI']['label'] : [ '1', '2', '3', '4' ],
						datasets: [
							{
								data: this.state.stocks['BBRI']
									? this.state.stocks['BBRI']['data']
									: [ Math.random() * 100, Math.random() * 100, Math.random() * 100 ]
							},
						]
					}}
					width={Dimensions.get('window').width} // from react-native
					height={220}
					yAxisInterval={1} // optional, defaults to 1
					chartConfig={{
						backgroundColor: '#e26a00',
						backgroundGradientFrom: '#fb8c00',
						backgroundGradientTo: '#ffa726',
						decimalPlaces: 2, // optional, defaults to 2dp
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 0
						},
						propsForDots: {
							r: '0',
							strokeWidth: '0',
							stroke: '#ffa726'
            },
            propsForBackgroundLines:{
              strokeWidth:"0"
            }
					}}
					bezier
					style={{
						margin: 8,
						borderRadius: 16
					}}
				/>
			</View>
		);
	}
}

export default App;
