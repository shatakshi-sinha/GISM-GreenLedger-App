import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Chip,
  Divider 
} from 'react-native-paper';
import { 
  LineChart,
  BarChart,
  PieChart
} from 'react-native-chart-kit';
import { emissionData, departments, chartColors } from '../../constants/Data';

const { width: screenWidth } = Dimensions.get('window');

export default function Reports() {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [14500, 13800, 13200, 12800, 12450, 11900],
    }]
  };

  const categoryData = [
    { name: 'Energy', population: 35, color: chartColors.energy, legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Transport', population: 28, color: chartColors.transport, legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Production', population: 18, color: chartColors.production, legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Facilities', population: 12, color: chartColors.facilities, legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Waste', population: 5, color: chartColors.waste, legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Other', population: 2, color: chartColors.other, legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  const departmentComparison = {
    labels: departments.map(dept => dept.name),
    datasets: [{
      data: departments.map(dept => dept.monthlyEmissions)
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Reports & Analytics</Title>
          <Paragraph>
            Comprehensive emissions reporting and sustainability analytics
          </Paragraph>
          <View style={styles.exportButtons}>
            <Button mode="outlined" icon="file-pdf" style={styles.exportButton}>
              Export PDF
            </Button>
            <Button mode="outlined" icon="file-excel" style={styles.exportButton}>
              Export Excel
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Monthly Trend */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Monthly Emissions Trend</Title>
          <LineChart
            data={monthlyData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=" kg"
            yAxisInterval={1}
          />
        </Card.Content>
      </Card>

      {/* Category Breakdown */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Emissions by Category</Title>
          <PieChart
            data={categoryData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
            absolute
          />
        </Card.Content>
      </Card>

      {/* Department Comparison */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Department Comparison</Title>
          <BarChart
            data={departmentComparison}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=" kg"
            showValuesOnTopOfBars
            fromZero
          />
        </Card.Content>
      </Card>

      {/* Compliance Report */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Compliance Report</Title>
          <View style={styles.complianceSection}>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceLabel}>ISO 14064-1:2018</Text>
              <Chip mode="outlined" style={styles.complianceChip}>85% Compliant</Chip>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceLabel}>GHG Protocol</Text>
              <Chip mode="outlined" style={styles.complianceChip}>78% Compliant</Chip>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceLabel}>ESG Reporting</Text>
              <Chip mode="outlined" style={styles.complianceChip}>65% Compliant</Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Emissions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Emission Entries</Title>
          {emissionData.slice(0, 3).map((entry, index) => (
            <View key={entry.id}>
              <View style={styles.entryItem}>
                <View>
                  <Text style={styles.entrySource}>{entry.source}</Text>
                  <Text style={styles.entryDetails}>
                    {entry.category} • {entry.department} • {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.entryValue}>
                  <Text style={styles.co2eValue}>{entry.co2e.toLocaleString()} kg</Text>
                  <Text style={styles.originalValue}>{entry.value.toLocaleString()} {entry.unit}</Text>
                </View>
              </View>
              {index < emissionData.slice(0, 3).length - 1 && <Divider />}
            </View>
          ))}
          <Button mode="text" icon="chevron-right" style={styles.viewAllButton}>
            View All Entries
          </Button>
        </Card.Content>
      </Card>

      {/* Summary Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Summary Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12,450</Text>
              <Text style={styles.statLabel}>Total CO₂e (kg)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-8.2%</Text>
              <Text style={styles.statLabel}>Monthly Trend</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>82%</Text>
              <Text style={styles.statLabel}>Compliance Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Departments</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerCard: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  exportButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  exportButton: {
    flex: 1,
  },
  card: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  complianceSection: {
    gap: 12,
  },
  complianceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complianceLabel: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  complianceChip: {
    height: 32,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  entrySource: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  entryDetails: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  entryValue: {
    alignItems: 'flex-end',
  },
  co2eValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  originalValue: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  viewAllButton: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
});