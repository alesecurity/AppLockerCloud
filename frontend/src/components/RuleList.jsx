import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import { deleteRule, updateRule } from '../services/api'
import PolicyTipsDialog, { getRuleTips } from './PolicyTips'

const RuleList = ({ rules, onEdit, onDelete }) => {
  const [tipsDialog, setTipsDialog] = useState({ open: false, rule: null })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await deleteRule(id)
        onDelete()
      } catch (error) {
        console.error('Failed to delete rule:', error)
      }
    }
  }

  const handleShowTips = (rule) => {
    setTipsDialog({ open: true, rule })
  }

  const handleCloseTips = () => {
    setTipsDialog({ open: false, rule: null })
  }

  const getCollectionColor = (collection) => {
    const colors = {
      Exe: 'primary',
      Script: 'secondary',
      Dll: 'success',
      Msi: 'warning',
      Appx: 'info',
    }
    return colors[collection] || 'default'
  }

  const getActionColor = (action) => {
    return action === 'Allow' ? 'success' : 'error'
  }

  if (!rules || !Array.isArray(rules) || rules.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No rules found. Click "Add Rule" to create your first rule.
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table sx={{ width: '100%', tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
            <TableCell sx={{ minWidth: 100, width: '10%' }}>Collection</TableCell>
            <TableCell sx={{ minWidth: 80, width: '8%' }}>Action</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, minWidth: 200 }}>Description</TableCell>
            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, minWidth: 150 }}>Conditions</TableCell>
            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, minWidth: 200 }}>Exceptions</TableCell>
            <TableCell align="right" sx={{ minWidth: 100, width: '10%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.filter(rule => rule != null).map((rule) => (
            <TableRow key={rule.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                  {rule.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={rule.collection}
                  color={getCollectionColor(rule.collection)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={rule.action}
                  color={getActionColor(rule.action)}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word', maxWidth: '400px' }}>
                  {rule.description || '-'}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                {rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '300px' }}>
                    {rule.conditions.map((condition, idx) => (
                      <Chip
                        key={idx}
                        label={condition?.type || 'Path'}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                {rule.exceptions && Array.isArray(rule.exceptions) && rule.exceptions.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '400px' }}>
                    {rule.exceptions.map((exception, idx) => {
                      let label = ''
                      if (exception?.type === 'FilePathCondition') {
                        label = exception.path || 'Path Exception'
                      } else if (exception?.type === 'FilePublisherCondition') {
                        label = `Publisher: ${exception.publisher_name || 'N/A'}`
                      } else if (exception?.type === 'FileHashCondition') {
                        const hash = exception.file_hash || ''
                        label = `Hash: ${hash.substring(0, 12)}... (SHA256)`
                      } else {
                        label = 'Exception'
                      }
                      const displayLabel = label.length > 50 ? label.substring(0, 47) + '...' : label
                      return (
                        <Tooltip key={idx} title={label.length > 50 ? label : ''} arrow>
                          <Chip
                            label={displayLabel}
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={{ maxWidth: '100%' }}
                          />
                        </Tooltip>
                      )
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                {(() => {
                  try {
                    if (rule && getRuleTips(rule).length > 0) {
                      return (
                        <Tooltip title="View improvement tips">
                          <IconButton
                            size="small"
                            onClick={() => handleShowTips(rule)}
                            color="warning"
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                    return null
                  } catch (error) {
                    console.error('Error getting rule tips:', error)
                    return null
                  }
                })()}
                <IconButton
                  size="small"
                  onClick={() => onEdit(rule)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(rule.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PolicyTipsDialog
        open={tipsDialog.open}
        onClose={handleCloseTips}
        rule={tipsDialog.rule}
        onRuleUpdate={async (ruleId, updates) => {
          try {
            await updateRule(ruleId, updates)
            onDelete() // Refresh the rules list
          } catch (error) {
            throw error
          }
        }}
      />
    </TableContainer>
  )
}

export default RuleList

