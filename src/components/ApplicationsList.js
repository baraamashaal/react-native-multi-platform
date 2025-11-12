import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { mockApplications } from '../data/mockData';

/**
 * CHALLENGE #5: Data Tables/Grids on React Native Web
 *
 * Major Issues:
 * 1. No native table component - must build with FlatList
 * 2. FlatList performance issues on web with large datasets
 * 3. Column resizing doesn't exist
 * 4. Horizontal scrolling is awkward on web
 * 5. No native sorting UI
 * 6. No built-in pagination components
 * 7. Can't use popular React table libraries (AG-Grid, TanStack Table, etc.)
 * 8. Accessibility is poor (no proper table semantics)
 * 9. Selection/checkboxes are manual
 * 10. Responsive design is very difficult
 */

const ApplicationsList = ({ onEdit, onDelete }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  /**
   * CHALLENGE #6: Manual Sorting Implementation
   * Libraries like TanStack Table handle this automatically
   */
  const sortedAndFilteredData = useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  }, [applications, sortField, sortDirection, filterStatus]);

  /**
   * CHALLENGE #7: Manual Pagination
   * Web libraries handle this with built-in components
   */
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredData.slice(startIndex, endIndex);
  }, [sortedAndFilteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIndicator = ({ field }) => {
    if (sortField !== field) return <Text style={styles.sortArrow}>⇅</Text>;
    return (
      <Text style={styles.sortArrowActive}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </Text>
    );
  };

  /**
   * CHALLENGE #8: Table Row Component
   * On web, we'd use <tr> and <td>. Here we must fake it with Views
   */
  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      {/* CHALLENGE: Fixed width columns are not responsive */}
      <View style={[styles.tableCell, styles.cellId]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>

      <View style={[styles.tableCell, styles.cellName]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellEmail]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.email}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellLocation]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.city}, {item.country}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellRole]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.role}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellSalary]}>
        <Text style={styles.cellText}>
          ${item.salary.toLocaleString()}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellStatus]}>
        <View style={[
          styles.statusBadge,
          item.status === 'submitted' ? styles.statusSubmitted : styles.statusDraft
        ]}>
          <Text style={styles.statusText}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={[styles.tableCell, styles.cellActions]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications List</Text>
        <Text style={styles.subtitle}>
          Total: {sortedAndFilteredData.length} applications
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by status:</Text>
        <View style={styles.filterButtons}>
          {['all', 'submitted', 'draft'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.filterButtonActive
              ]}
              onPress={() => {
                setFilterStatus(status);
                setCurrentPage(1); // Reset to first page
              }}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CHALLENGE #9: Horizontal ScrollView for table on small screens */}
      {/* On web, this creates awkward scrolling experience */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <TouchableOpacity
              style={[styles.tableCell, styles.cellId, styles.headerCell]}
              onPress={() => handleSort('id')}
            >
              <Text style={styles.headerText}>ID</Text>
              <SortIndicator field="id" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tableCell, styles.cellName, styles.headerCell]}
              onPress={() => handleSort('firstName')}
            >
              <Text style={styles.headerText}>Name</Text>
              <SortIndicator field="firstName" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tableCell, styles.cellEmail, styles.headerCell]}
              onPress={() => handleSort('email')}
            >
              <Text style={styles.headerText}>Email</Text>
              <SortIndicator field="email" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tableCell, styles.cellLocation, styles.headerCell]}
              onPress={() => handleSort('country')}
            >
              <Text style={styles.headerText}>Location</Text>
              <SortIndicator field="country" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tableCell, styles.cellRole, styles.headerCell]}
              onPress={() => handleSort('role')}
            >
              <Text style={styles.headerText}>Role</Text>
              <SortIndicator field="role" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tableCell, styles.cellSalary, styles.headerCell]}
              onPress={() => handleSort('salary')}
            >
              <Text style={styles.headerText}>Salary</Text>
              <SortIndicator field="salary" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tableCell, styles.cellStatus, styles.headerCell]}
              onPress={() => handleSort('status')}
            >
              <Text style={styles.headerText}>Status</Text>
              <SortIndicator field="status" />
            </TouchableOpacity>

            <View style={[styles.tableCell, styles.cellActions, styles.headerCell]}>
              <Text style={styles.headerText}>Actions</Text>
            </View>
          </View>

          {/* CHALLENGE #10: FlatList inside ScrollView is problematic */}
          {/* On web, this causes performance and scrolling issues */}
          <FlatList
            data={paginatedData}
            renderItem={renderTableRow}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Disable FlatList scroll, use outer ScrollView
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No applications found</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <Text style={[
              styles.paginationButtonText,
              currentPage === 1 && styles.paginationButtonTextDisabled
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.pageNumbers}>
            {[...Array(totalPages)].map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  styles.pageNumber,
                  currentPage === index + 1 && styles.pageNumberActive
                ]}
                onPress={() => setCurrentPage(index + 1)}
              >
                <Text style={[
                  styles.pageNumberText,
                  currentPage === index + 1 && styles.pageNumberTextActive
                ]}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.paginationButtonDisabled
            ]}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <Text style={[
              styles.paginationButtonText,
              currentPage === totalPages && styles.paginationButtonTextDisabled
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedAndFilteredData.length)} of {sortedAndFilteredData.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  filterButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  table: {
    minWidth: 1200, // CHALLENGE: Fixed width doesn't work well on all screens
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 48,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  sortArrow: {
    fontSize: 12,
    color: '#999',
  },
  sortArrowActive: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  // CHALLENGE: Manual column widths
  cellId: { width: 60 },
  cellName: { width: 150 },
  cellEmail: { width: 200 },
  cellLocation: { width: 180 },
  cellRole: { width: 150 },
  cellSalary: { width: 120 },
  cellStatus: { width: 100 },
  cellActions: { width: 160 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusSubmitted: {
    backgroundColor: '#4caf50',
  },
  statusDraft: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#1976d2',
    marginRight: 8,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1976d2',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  paginationButtonDisabled: {
    backgroundColor: '#ddd',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#999',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  pageNumberActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  pageNumberText: {
    fontSize: 14,
    color: '#333',
  },
  pageNumberTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ApplicationsList;
