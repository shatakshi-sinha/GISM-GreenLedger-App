import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton } from 'react-native-paper';
import { departments } from '../../constants/Data';

export default function Departments() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Department Management</Title>
          <Paragraph>
            Monitor and manage emissions across all organizational departments
          </Paragraph>
        </Card.Content>
      </Card>

      {departments.map((department) => (
        <Card key={department.id} style={styles.departmentCard}>
          <Card.Content>
            <View style={styles.departmentHeader}>
              <View>
                <Title style={styles.departmentName}>{department.name}</Title>
                <Paragraph>Manager: {department.manager}</Paragraph>
              </View>
              <Chip 
                icon={department.trend === 'down' ? 'trending-down' : 
                      department.trend === 'up' ? 'trending-up' : 'minus'}
                mode="outlined"
                style={[
                  styles.trendChip,
                  { 
                    backgroundColor: 
                      department.trend === 'down' ? '#dcfce7' :
                      department.trend === 'up' ? '#fef2f2' : '#f0f9ff'
                  }
                ]}
              >
                {department.trend === 'down' ? 'Decreasing' : 
                 department.trend === 'up' ? 'Increasing' : 'Stable'}
              </Chip>
            </View>
            
            <View style={styles.emissionSection}>
              <Text style={styles.emissionLabel}>Monthly Emissions:</Text>
              <Text style={styles.emissionValue}>
                {department.monthlyEmissions.toLocaleString()} kg CO₂e
              </Text>
            </View>

            <View style={styles.sourcesSection}>
              <Text style={styles.sourcesLabel}>Emission Sources:</Text>
              <View style={styles.chipsContainer}>
                {department.emissionSources.map((source, index) => (
                  <Chip 
                    key={index}
                    mode="outlined"
                    style={styles.sourceChip}
                    textStyle={styles.sourceChipText}
                  >
                    {source}
                  </Chip>
                ))}
              </View>
            </View>

            <View style={styles.actions}>
              <IconButton
                icon="chart-box"
                size={20}
                onPress={() => {}}
                style={styles.actionButton}
              />
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => {}}
                style={styles.actionButton}
              />
              <IconButton
                icon="information"
                size={20}
                onPress={() => {}}
                style={styles.actionButton}
              />
            </View>
          </Card.Content>
        </Card>
      ))}

      <Card style={styles.addCard}>
        <Card.Content style={styles.addCardContent}>
          <IconButton
            icon="plus-circle"
            size={40}
            iconColor="#10b981"
            onPress={() => {}}
          />
          <Text style={styles.addCardText}>Add New Department</Text>
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
  departmentCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  trendChip: {
    height: 32,
  },
  emissionSection: {
    marginBottom: 12,
  },
  emissionLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  emissionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sourcesSection: {
    marginBottom: 12,
  },
  sourcesLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sourceChip: {
    height: 28,
    backgroundColor: '#f8fafc',
  },
  sourceChipText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  actionButton: {
    margin: 0,
    marginLeft: 8,
  },
  addCard: {
    margin: 10,
    backgroundColor: '#ffffff',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  addCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  addCardText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
});