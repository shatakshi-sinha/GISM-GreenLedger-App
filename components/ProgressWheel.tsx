import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const size = width * 0.7;
const strokeWidth = 20;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

const segments = [
  { label: 'Energy', value: 35, color: '#f59e0b' },
  { label: 'Transport', value: 28, color: '#3b82f6' },
  { label: 'Production', value: 18, color: '#8b5cf6' },
  { label: 'Facilities', value: 12, color: '#06b6d4' },
  { label: 'Waste', value: 5, color: '#ef4444' },
  { label: 'Other', value: 2, color: '#64748b' },
];

export default function ProgressWheel() {
  let currentAngle = -90;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          {segments.map((segment, index) => {
            const segmentAngle = (segment.value / 100) * 360;
            const strokeDasharray = `${(segment.value / 100) * circumference} ${circumference}`;
            
            const segmentElement = (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                fill="transparent"
                rotation={currentAngle}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
            
            currentAngle += segmentAngle;
            return segmentElement;
          })}
        </G>
        
        <SvgText
          x={size / 2}
          y={size / 2 - 10}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#1e293b"
        >
          Emissions
        </SvgText>
        <SvgText
          x={size / 2}
          y={size / 2 + 15}
          textAnchor="middle"
          fontSize="14"
          fill="#64748b"
        >
          Breakdown
        </SvgText>
      </Svg>
      
      <View style={styles.legend}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: segment.color }
              ]} 
            />
            <Text style={styles.legendText}>
              {segment.label}: {segment.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  legend: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
});