import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  DataTable, 
  Button, 
  IconButton,
  Searchbar,
  Chip,
  TextInput,
  Modal,
  Portal,
  Provider,
  Menu,
  Divider
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

interface EmissionEntry {
  id: string;
  date: string;
  category: string;
  source: string;
  value: number;
  unit: string;
  co2e: number;
  department: string;
}

const initialEmissions: EmissionEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    category: "Energy",
    source: "Electricity",
    value: 12500,
    unit: "kWh",
    co2e: 6850,
    department: "Facilities"
  },
  {
    id: "2",
    date: "2024-01-15",
    category: "Transport",
    source: "Company Vehicles",
    value: 2450,
    unit: "liters",
    co2e: 5800,
    department: "Transport"
  }
];

export default function Emissions() {
  const [emissions, setEmissions] = useState<EmissionEntry[]>(initialEmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string>('');
  const [selectedEmission, setSelectedEmission] = useState<string>('');
  
  const [newEmission, setNewEmission] = useState({
    category: 'Energy',
    source: '',
    value: '',
    unit: 'kWh',
    department: 'Facilities'
  });

  const categories = ['All', 'Energy', 'Transport', 'Production', 'Facilities', 'Waste'];
  const departments = ['Facilities', 'Transport', 'Production', 'Energy'];

  const filteredData = emissions.filter(entry => {
    const matchesSearch = entry.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateCO2e = (category: string, value: number): number => {
    switch (category) {
      case 'Energy': return value * 0.85;
      case 'Transport': return value * 2.68;
      case 'Production': return value * 7.1;
      case 'Facilities': return value * 0.45;
      case 'Waste': return value * 1.2;
      default: return value;
    }
  };

  const handleAddEmission = () => {
    if (!newEmission.source.trim() || !newEmission.value.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const value = parseFloat(newEmission.value);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Error', 'Please enter a valid emission value');
      return;
    }

    const emission: EmissionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: newEmission.category,
      source: newEmission.source,
      value: value,
      unit: newEmission.unit,
      co2e: calculateCO2e(newEmission.category, value),
      department: newEmission.department
    };

    setEmissions([emission, ...emissions]);
    setNewEmission({
      category: 'Energy',
      source: '',
      value: '',
      unit: 'kWh',
      department: 'Facilities'
    });
    setModalVisible(false);
    Alert.alert('Success', 'Emission entry added successfully!');
  };

  const handleDeleteEmission = () => {
    setEmissions(prev => prev.filter(emission => emission.id !== selectedEmission));
    setDeleteModalVisible(false);
    setMenuVisible('');
    Alert.alert('Success', 'Emission entry deleted successfully!');
  };

  const openDeleteModal = (emissionId: string) => {
    setSelectedEmission(emissionId);
    setDeleteModalVisible(true);
    setMenuVisible('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Energy': return Colors.chart.energy;
      case 'Transport': return Colors.chart.transport;
      case 'Production': return Colors.chart.production;
      case 'Facilities': return Colors.chart.facilities;
      case 'Waste': return Colors.chart.waste;
      default: return Colors.chart.other;
    }
  };

  const totalEmissions = emissions.reduce((sum, entry) => sum + entry.co2e, 0);

  return (
    <Provider>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={styles.headerTitle}>Emissions Tracker</Title>
                <Paragraph style={styles.headerSubtitle}>
                  Track and manage all carbon emission sources across your organization
                </Paragraph>
              </View>
              <Button 
                mode="contained" 
                icon="plus"
                onPress={() => setModalVisible(true)}
              >
                Add Entry
              </Button>
            </View>
            
            {/* Summary Stats */}
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{emissions.length}</Text>
                <Text style={styles.statLabel}>Total Entries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalEmissions.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total CO₂e (kg)</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {categories.length - 1}
                </Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Search and Filter */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <Searchbar
              placeholder="Search emissions by source or department..."
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
                mode="outlined" 
                icon="calculator" 
                style={styles.actionButton}
                onPress={() => Alert.alert('Calculator', 'Carbon calculator opened')}
              >
                Calculator
              </Button>
              <Button 
                mode="outlined" 
                icon="upload" 
                style={styles.actionButton}
                onPress={() => Alert.alert('Import', 'Import data from file')}
              >
                Import Data
              </Button>
              <Button 
                mode="outlined" 
                icon="download" 
                style={styles.actionButton}
                onPress={() => Alert.alert('Export', 'Export data to CSV')}
              >
                Export
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Emissions Table */}
        <Card style={styles.tableCard}>
          <Card.Content>
            <View style={styles.tableHeader}>
              <Title>Recent Emissions ({filteredData.length})</Title>
              <Button 
                mode="text" 
                icon="refresh"
                onPress={() => Alert.alert('Refresh', 'Data refreshed')}
              >
                Refresh
              </Button>
            </View>

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
                  <DataTable.Cell>
                    <Text style={styles.dateText}>
                      {new Date(entry.date).toLocaleDateString()}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      mode="outlined" 
                      compact 
                      textStyle={{ 
                        fontSize: 10,
                        color: getCategoryColor(entry.category)
                      }}
                      style={{ borderColor: getCategoryColor(entry.category) }}
                    >
                      {entry.category}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.valueText}>
                      {entry.value.toLocaleString()} {entry.unit}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.co2eText}>
                      {entry.co2e.toLocaleString()} kg
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Menu
                      visible={menuVisible === entry.id}
                      onDismiss={() => setMenuVisible('')}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          size={16}
                          onPress={() => setMenuVisible(entry.id)}
                        />
                      }
                    >
                      <Menu.Item 
                        leadingIcon="pencil" 
                        onPress={() => Alert.alert('Edit', `Edit ${entry.source}`)} 
                        title="Edit Entry" 
                      />
                      <Menu.Item 
                        leadingIcon="chart-box" 
                        onPress={() => Alert.alert('Analytics', `View analytics for ${entry.source}`)} 
                        title="View Analytics" 
                      />
                      <Divider />
                      <Menu.Item 
                        leadingIcon="delete" 
                        onPress={() => openDeleteModal(entry.id)} 
                        title="Delete" 
                        titleStyle={{ color: Colors.error }}
                      />
                    </Menu>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>

            {filteredData.length === 0 && (
              <View style={styles.emptyState}>
                <IconButton
                  icon="cloud-off-outline"
                  size={48}
                  iconColor={Colors.textTertiary}
                />
                <Text style={styles.emptyStateText}>
                  No emissions found matching your criteria
                </Text>
                <Button 
                  mode="outlined" 
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  style={styles.emptyStateButton}
                >
                  Clear Filters
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Emission Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Add New Emission Entry</Title>
              
              <TextInput
                label="Source *"
                value={newEmission.source}
                onChangeText={(text) => setNewEmission(prev => ({ ...prev, source: text }))}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., Electricity, Company Vehicles"
              />

              <View style={styles.inputRow}>
                <TextInput
                  label="Value *"
                  value={newEmission.value}
                  onChangeText={(text) => setNewEmission(prev => ({ ...prev, value: text }))}
                  keyboardType="numeric"
                  style={[styles.input, styles.flexInput]}
                  mode="outlined"
                  placeholder="0"
                />
                <TextInput
                  label="Unit"
                  value={newEmission.unit}
                  onChangeText={(text) => setNewEmission(prev => ({ ...prev, unit: text }))}
                  style={[styles.input, styles.unitInput]}
                  mode="outlined"
                  placeholder="kWh"
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  label="Category"
                  value={newEmission.category}
                  onChangeText={(text) => setNewEmission(prev => ({ ...prev, category: text }))}
                  style={[styles.input, styles.flexInput]}
                  mode="outlined"
                />
                <TextInput
                  label="Department"
                  value={newEmission.department}
                  onChangeText={(text) => setNewEmission(prev => ({ ...prev, department: text }))}
                  style={[styles.input, styles.flexInput]}
                  mode="outlined"
                />
              </View>

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleAddEmission}
                  style={styles.modalButton}
                >
                  Add Emission
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* Delete Confirmation Modal */}
      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Delete Emission Entry</Title>
              <Paragraph style={styles.modalSubtitle}>
                Are you sure you want to delete this emission entry?
                This action cannot be undone.
              </Paragraph>

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  buttonColor={Colors.error}
                  onPress={handleDeleteEmission}
                  style={styles.modalButton}
                >
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  filterCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
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
    margin: 16,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  tableCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  valueText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  co2eText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.textTertiary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  emptyStateButton: {
    minWidth: 120,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexInput: {
    flex: 1,
  },
  unitInput: {
    width: 100,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});