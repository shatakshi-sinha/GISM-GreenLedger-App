import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  DataTable, 
  Button, 
  IconButton,
  Searchbar,
  Chip,
  Divider 
} from 'react-native-paper';
import { emissionData } from '../../constants/Data';

export default function Emissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Energy', 'Transport', 'Production', 'Facilities', 'Waste'];

  const filteredData = emissionData.filter(entry => {
    const matchesSearch = entry.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Emissions Tracker</Title>
          <Paragraph>
            Track and manage all carbon emission sources across your organization
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Search and Filter */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <Searchbar
            placeholder="Search emissions..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={styles.categoryChip}
                mode={selectedCategory === category ? 'flat' : 'outlined'}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.actionsTitle}>Quick Actions</Title>
          <View style={styles.actionsRow}>
            <Button 
              mode="contained" 
              icon="plus" 
              style={styles.actionButton}
              onPress={() => {}}
            >
              Add Entry
            </Button>
            <Button 
              mode="outlined" 
              icon="calculator" 
              style={styles.actionButton}
              onPress={() => {}}
            >
              Calculator
            </Button>
            <Button 
              mode="outlined" 
              icon="upload" 
              style={styles.actionButton}
              onPress={() => {}}
            >
              Import
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Emissions Table */}
      <Card style={styles.tableCard}>
        <Card.Content>
          <Title>Recent Emissions</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Category</DataTable.Title>
              <DataTable.Title numeric>Value</DataTable.Title>
              <DataTable.Title numeric>CO₂e</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>

            {filteredData.map((entry) => (
              <DataTable.Row key={entry.id}>
                <DataTable.Cell>{new Date(entry.date).toLocaleDateString()}</DataTable.Cell>
                <DataTable.Cell>
                  <Chip 
                    mode="outlined" 
                    compact 
                    textStyle={{ fontSize: 10 }}
                  >
                    {entry.category}
                  </Chip>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {entry.value.toLocaleString()} {entry.unit}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {entry.co2e.toLocaleString()} kg
                </DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.rowActions}>
                    <IconButton
                      icon="pencil"
                      size={16}
                      onPress={() => {}}
                    />
                    <IconButton
                      icon="delete"
                      size={16}
                      onPress={() => {}}
                    />
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          {filteredData.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No emissions found matching your criteria
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Carbon Calculator */}
      <Card style={styles.calculatorCard}>
        <Card.Content>
          <Title>Carbon Calculator</Title>
          <Paragraph>
            Quickly calculate CO₂ equivalent for common emission sources
          </Paragraph>
          
          <View style={styles.calculatorForm}>
            <Button 
              mode="contained" 
              icon="lightning-bolt"
              style={styles.calculatorButton}
              onPress={() => {}}
            >
              Electricity Calculator
            </Button>
            <Button 
              mode="contained" 
              icon="car"
              style={styles.calculatorButton}
              onPress={() => {}}
            >
              Vehicle Calculator
            </Button>
            <Button 
              mode="contained" 
              icon="factory"
              style={styles.calculatorButton}
              onPress={() => {}}
            >
              Production Calculator
            </Button>
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
  filterCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    marginBottom: 12,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    marginRight: 8,
  },
  actionsCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  actionsTitle: {
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  tableCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  rowActions: {
    flexDirection: 'row',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 14,
  },
  calculatorCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  calculatorForm: {
    gap: 8,
    marginTop: 12,
  },
  calculatorButton: {
    marginVertical: 4,
  },
});