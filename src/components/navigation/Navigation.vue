<template>
  <ods-menu
    data-name="OdsNavigation"
    class="ods-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    menuTrigger="click"
    position="fixed"
    :isFirstLevel="true">
      <li v-if="showLogo" class="ods-menu--logo" @click="isCollapse = !isCollapse">
        <ods-icon class="ods-menu--logo__icon" name="logo"></ods-icon>
      </li>
      {{ tree }}

  </ods-menu>
</template>

<script>
import OdsMenu from '@/components/menu/Menu'

export default {
  name: 'OdsNavigation',
  version: '2.0.0',
  category: 'navigation',
  lastDate: '13/04/2020',
  componentName: 'OdsNavigation',
  syncStatus: 'discarded',
  props: {
    data: {
      type: [ Array ],
      default: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          routeName: 'home',
          children: []
        },
        {
          label: 'First Menu Option',
          icon: 'list',
          routeName: '',
          children: [
            {
              label: 'Submenu first item',
              icon: '',
              routeName: '',
              children: [
                {
                  label: 'Option 1',
                  icon: '',
                  routeName: 'option1',
                  children: []
                },
                {
                  label: 'Option 2',
                  icon: '',
                  routeName: 'option2',
                  children: []
                }
              ]
            },
            {
              label: 'Submenu second item',
              icon: '',
              routeName: '',
              children: []
            }
          ]
        },
        {
          label: 'Second Menu Option',
          icon: 'user',
          routeName: '',
          children: []
        }
      ]
    },
    showLogo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tree: ''
    }
  },
  created () {
    this.data.forEach((node, i) => {
      if (node.children.length) {
        this.tree += `<ods-submenu index="${i}">
                        <template slot="title">
                          <i class="ods-icon-${node.icon}"></i>
                          <span slot="title2">${node.label}</span>
                        </template>`
        node.children.forEach((subnode, j) => {
          if (subnode.children.length) {
            this.tree += `<ods-submenu index="${i}-${j}" menu-trigger="click">
                            <span slot="title"><span>${subnode.label}</span></span>`
            subnode.children.forEach((subsubnode, k) => {
              this.tree += `<ods-menu-item index="${i}-${j}-${k}">${subsubnode.label}</ods-menu-item>`
            })
            this.tree += `</ods-submenu>`
          } else {
            this.tree += `<ods-menu-item index="${i}-${j}">${subsubnode.label}</ods-menu-item>`
          }
        })
        this.tree += `</ods-submenu>`
      } else {
        this.tree += `<ods-menu-item index="${i}">
                          <i class="ods-icon-${node.icon}"></i>
                          <span slot="title">${node.label}</span>
                      </ods-menu-item>`
      }
    })
  }
}
</script>
