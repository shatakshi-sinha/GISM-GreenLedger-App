import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  Button,
  Searchbar,
  IconButton 
} from 'react-native-paper';
import { reductionStrategies } from '../../constants/Data';

export default function Strategies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const statusFilters = ['All', 'Not Started', 'In Progress', 'Completed'];
  const difficultyFilters = ['All', 'Low', 'Medium', 'High'];

  const filteredStrategies = reductionStrategies.filter(strategy => {
    const matchesSearch = strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || strategy.status === selectedStatus;
    const matchesDifficulty = selectedDifficulty === 'All' || strategy.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Not Started': return '#64748b';
      default: return '#64748b';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Reduction Strategies</Title>
          <Paragraph>
            Implement carbon reduction strategies to achieve sustainability goals
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Filters */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <Searchbar
            placeholder="Search strategies..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              {statusFilters.map((status) => (
                <Chip
                  key={status}
                  selected={selectedStatus === status}
                  onPress={() => setSelectedStatus(status)}
                  style={styles.filterChip}
                  mode={selectedStatus === status ? 'flat' : 'outlined'}
                >
                  {status}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>Difficulty:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              {difficultyFilters.map((difficulty) => (
                <Chip
                  key={difficulty}
                  selected={selectedDifficulty === difficulty}
                  onPress={() => setSelectedDifficulty(difficulty)}
                  style={styles.filterChip}
                  mode={selectedDifficulty === difficulty ? 'flat' : 'outlined'}
                >
                  {difficulty}
                </Chip>
              ))}
            </ScrollView>
          </View>
        </Card.Content>
      </Card>

      {/* Strategy Cards */}
      {filteredStrategies.map((strategy) => (
        <Card key={strategy.id} style={styles.strategyCard}>
          <Card.Content>
            <View style={styles.strategyHeader}>
              <Title style={styles.strategyTitle}>{strategy.title}</Title>
              <Chip 
                mode="outlined"
                textStyle={{ fontSize: 12, color: getStatusColor(strategy.status) }}
                style={[styles.statusChip, { borderColor: getStatusColor(strategy.status) }]}
              >
                {strategy.status}
              </Chip>
            </View>

            <Paragraph style={styles.strategyDescription}>
              {strategy.description}
            </Paragraph>

            <View style={styles.strategyMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Category</Text>
                <Chip mode="outlined" compact style={styles.metaChip}>
                  {strategy.category}
                </Chip>
              </View>
              
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Impact</Text>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={[styles.metaChip, { borderColor: getImpactColor(strategy.impact) }]}
                  textStyle={{ color: getImpactColor(strategy.impact) }}
                >
                  {strategy.impact} Impact
                </Chip>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Difficulty</Text>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={[styles.metaChip, { borderColor: getDifficultyColor(strategy.difficulty) }]}
                  textStyle={{ color: getDifficultyColor(strategy.difficulty) }}
                >
                  {strategy.difficulty}
                </Chip>
              </View>
            </View>

            <View style={styles.strategyDetails}>
              <View style={styles.detailItem}>
                <IconButton icon="clock-outline" size={16} />
                <Text style={styles.detailText}>{strategy.implementationTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <IconButton icon="cash" size={16} />
                <Text style={styles.detailText}>{strategy.cost} Cost</Text>
              </View>
            </View>

            <View style={styles.strategyActions}>
              <Button 
                mode="outlined" 
                compact 
                style={styles.actionButton}
                onPress={() => {}}
              >
                Learn More
              </Button>
              <Button 
                mode="contained" 
                compact 
                style={styles.actionButton}
                onPress={() => {}}
              >
                Implement
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Add New Strategy */}
      <Card style={styles.addCard}>
        <Card.Content style={styles.addCardContent}>
          <IconButton
            icon="plus-circle"
            size={40}
            iconColor="#10b981"
            onPress={() => {}}
          />
          <Text style={styles.addCardText}>Add New Strategy</Text>
          <Paragraph style={styles.addCardDescription}>
            Create custom carbon reduction strategies for your organization
          </Paragraph>
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
  filtersContainer: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filterChip: {
    marginRight: 8,
  },
  strategyCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  strategyTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 24,
  },
  strategyDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  strategyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  metaChip: {
    height: 24,
  },
  strategyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: -8,
  },
  strategyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
    fontWeight: '600',
  },
  addCardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});