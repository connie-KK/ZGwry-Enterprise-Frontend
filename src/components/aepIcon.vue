<template>
  <svg
    version="1.1"
    :class="klass"
    :role="label ? 'img' : 'presentation'"
    :aria-label="label"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :viewBox="box"
    :style="style"
  >
    <template v-for="(value, key, j) in iconAttrs">
      <component
        :is="'icon-' + key.slice(0, -1)"
        :order="j"
        :attrs="value"
        :key="j"
      />
    </template>
  </svg>
</template>

<style>
.aep-icon {
  display: inline-block;
  fill: currentColor;
}

.aep-flip-horizontal {
  transform: scale(-1, 1);
}

.aep-flip-vertical {
  transform: scale(1, -1);
}

.aep-spin {
  animation: fa-spin 1s 0s infinite linear;
}

.aep-inverse {
  color: #fff;
}

.aep-pulse {
  animation: fa-spin 1s infinite steps(8);
}

@keyframes aep-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script>
import Vue from 'vue'
let icons = []
const shapes = ['circle', 'rect', 'path', 'polygon']
for (let i = 0; i < shapes.length; i++) {
  const shape = shapes[i]
  Vue.component('icon-' + shape, {
    props: {
      order: {
        type: Number,
        required: true
      },
      attrs: {
        type: Array,
        default: () => []
      }
    },
    render: function(createElement) {
      // NOTE: 这个特别奇怪，用箭头函数无法保存this, 导致attrs拿不到
      let self = this
      if (self.attrs && self.attrs.length) {
        return createElement(
          'g',
          self.attrs.map(attr => {
            return createElement(shape, { attrs: attr })
          })
        )
      } else {
        return createElement('')
      }
    }
  })
}

let cursor = 0xd4937
function getId() {
  return `aep-${(cursor++).toString(16)}`
}
export default {
  name: 'icon',
  props: {
    name: {
      type: String,
      validator(val) {
        if (val) {
          if (!(val in icons)) {
            console.warn(
              `Invalid prop: prop "name" is referring to an unregistered icon "${val}".` +
                '\nPlease make sure you have imported this icon before using it.'
            )
            return false
          }
          return true
        }
        console.warn('Invalid prop: prop "name" is required.')
        return false
      }
    },
    scale: [Number, String],
    spin: Boolean,
    inverse: Boolean,
    pulse: Boolean,
    flip: {
      validator(val) {
        return val === 'horizontal' || val === 'vertical'
      }
    },
    label: String
  },
  data() {
    return {
      x: false,
      y: false,
      childrenWidth: 0,
      childrenHeight: 0,
      outerScale: 1,
      types: ['circles', 'rects', 'paths', 'polygons']
    }
  },
  computed: {
    normalizedScale() {
      let scale = this.scale
      scale = typeof scale === 'undefined' ? 1 : Number(scale)
      if (isNaN(scale) || scale <= 0) {
        console.warn(
          'Invalid prop: prop "scale" should be a number over 0.',
          this
        )
        return this.outerScale
      }
      return scale * this.outerScale
    },
    klass() {
      const classes = {
        'aep-icon': true,
        'aep-spin': this.spin,
        'aep-flip-horizontal': this.flip === 'horizontal',
        'aep-flip-vertical': this.flip === 'vertical',
        'aep-inverse': this.inverse,
        'aep-pulse': this.pulse
      }
      classes[`aep-${this.name}`] = true
      return classes
    },
    icon() {
      if (this.name) {
        return icons[this.name]
      }
      return null
    },
    iconAttrs() {
      const temp = {}
      for (let key in this.icon) {
        if (this.types.includes(key)) {
          temp[key] = this.icon[key]
        }
      }
      return temp
    },
    box() {
      if (this.icon) {
        return `0 0 ${this.icon.width} ${this.icon.height}`
      }
      return `0 0 ${this.width} ${this.height}`
    },
    ratio() {
      if (!this.icon) {
        return 1
      }
      let { width, height } = this.icon
      return Math.max(width, height) / 16
    },
    width() {
      return (
        this.childrenWidth ||
        (this.icon && (this.icon.width / this.ratio) * this.normalizedScale) ||
        0
      )
    },
    height() {
      return (
        this.childrenHeight ||
        (this.icon && (this.icon.height / this.ratio) * this.normalizedScale) ||
        0
      )
    },
    style() {
      if (this.normalizedScale === 1) {
        return false
      }
      return {
        fontSize: this.normalizedScale + 'em'
      }
    },
    raw() {
      // generate unique id for each icon's SVG element with ID
      if (!this.icon || !this.icon.raw) {
        return null
      }
      let raw = this.icon.raw
      let ids = {}
      raw = raw.replace(
        /\s(?:xml:)?id=(["']?)([^"')\s]+)\1/g,
        (match, quote, id) => {
          let uniqueId = getId()
          ids[id] = uniqueId
          return ` id="${uniqueId}"`
        }
      )
      raw = raw.replace(
        /#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g,
        (match, rawId, _, pointerId) => {
          let id = rawId || pointerId
          if (!id || !ids[id]) {
            return match
          }

          return `#${ids[id]}`
        }
      )

      return raw
    }
  },
  mounted() {
    if (this.icon) {
      return
    }
    this.$children.forEach(child => {
      child.outerScale = this.normalizedScale
    })
    let width = 0
    let height = 0
    this.$children.forEach(child => {
      width = Math.max(width, child.width)
      height = Math.max(height, child.height)
    })
    this.childrenWidth = width
    this.childrenHeight = height
    this.$children.forEach(child => {
      child.x = (width - child.width) / 2
      child.y = (height - child.height) / 2
    })
  },
  register(data) {
    for (let name in data) {
      let icon = data[name]
      icons[name] = icon
    }
  }
}
</script>
