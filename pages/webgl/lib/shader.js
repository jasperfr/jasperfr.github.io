/*
    Simple Shader library
    Imported from Webgl-Utils
    Copyright (C) 2022 jasperfr

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Simple Shader library.
 * 
 * @module webgl-shader
 */
 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['shader'], factory);
    } else {
        root.shader = factory();
    }
}(this, function() {
    "use strict";

    function getBindPointForSamplerType(gl, type) {
        if (type === gl.SAMPLER_2D)   return gl.TEXTURE_2D;
        if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;
        return undefined;
    }

    function loadUniformData(gl, program) {
        let textureID = 0;
        function createUniformSetter(program, uniform) {
            const location = gl.getUniformLocation(program, uniform.name);
            const type = uniform.type;
            const isArray = (uniform.size > 1 && uniform.name.substr(-3) === '[0]');

            if (type === gl.FLOAT && isArray) {
                return function(v) {
                    gl.uniform1fv(location, v);
                };
            }
            if (type === gl.FLOAT) {
                return function(v) {
                    gl.uniform1f(location, v);
                };
            }
            if (type === gl.FLOAT_VEC2) {
                return function(v) {
                    gl.uniform2fv(location, v);
                };
            }
            if (type === gl.FLOAT_VEC3) {
                return function(v) {
                    gl.uniform3fv(location, v);
                };
            }
            if (type === gl.FLOAT_VEC4) {
                return function(v) {
                    gl.uniform4fv(location, v);
                };
            }
            if (type === gl.INT && isArray) {
                return function(v) {
                    gl.uniform1iv(location, v);
                };
            }
            if (type === gl.INT) {
                return function(v) {
                    gl.uniform1i(location, v);
                };
            }
            if (type === gl.INT_VEC2) {
                return function(v) {
                    gl.uniform2iv(location, v);
                };
            }
            if (type === gl.INT_VEC3) {
                return function(v) {
                    gl.uniform3iv(location, v);
                };
            }
            if (type === gl.INT_VEC4) {
                return function(v) {
                    gl.uniform4iv(location, v);
                };
            }
            if (type === gl.BOOL) {
                return function(v) {
                    gl.uniform1iv(location, v);
                };
            }
            if (type === gl.BOOL_VEC2) {
                return function(v) {
                    gl.uniform2iv(location, v);
                };
            }
            if (type === gl.BOOL_VEC3) {
                return function(v) {
                    gl.uniform3iv(location, v);
                };
            }
            if (type === gl.BOOL_VEC4) {
                return function(v) {
                    gl.uniform4iv(location, v);
                };
            }
            if (type === gl.FLOAT_MAT2) {
                return function(v) {
                    gl.uniformMatrix2fv(location, false, v);
                };
            }
            if (type === gl.FLOAT_MAT3) {
                return function(v) {
                    gl.uniformMatrix3fv(location, false, v);
                };
            }
            if (type === gl.FLOAT_MAT4) {
                return function(v) {
                    gl.uniformMatrix4fv(location, false, v);
                };
            }
            if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
                const units = [];
                for (let ii = 0; ii < info.size; ++ii) {
                    units.push(textureID++);
                }
                return function(bindPoint, units) {
                    return function(textures) {
                        gl.uniform1iv(location, units);
                        textures.forEach(function(texture, index) {
                            gl.activeTexture(gl.TEXTURE0 + units[index]);
                            gl.bindTexture(bindPoint, texture);
                        });
                    };
                }(getBindPointForSamplerType(gl, type), units);
            }
            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
                return function(bindPoint, unit) {
                    return function(texture) {
                        gl.uniform1i(location, unit);
                        gl.activeTexture(gl.TEXTURE0 + unit);
                        gl.bindTexture(bindPoint, texture);
                    };
                }(getBindPointForSamplerType(gl, type), textureID++);
            }
            throw ('unknown type: 0x' + type.toString(16)); // we should never get here.
        }
  
        const uniformSetters = { };
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    
        for (let ii = 0; ii < numUniforms; ++ii) {
          const uniformInfo = gl.getActiveUniform(program, ii);
          if (!uniformInfo) {
            break;
          }
          let name = uniformInfo.name;
          // remove the array suffix.
          if (name.substr(-3) === '[0]') {
            name = name.substr(0, name.length - 3);
          }
          const setter = createUniformSetter(program, uniformInfo);
          uniformSetters[name] = setter;
        }
        return uniformSetters;
    }

    function loadAttributeData(gl, program) {
        function createAttribSetter(index) {
            return function(b) {
                if (b.value) {
                  gl.disableVertexAttribArray(index);
                  switch (b.value.length) {
                    case 4:
                      gl.vertexAttrib4fv(index, b.value);
                      break;
                    case 3:
                      gl.vertexAttrib3fv(index, b.value);
                      break;
                    case 2:
                      gl.vertexAttrib2fv(index, b.value);
                      break;
                    case 1:
                      gl.vertexAttrib1fv(index, b.value);
                      break;
                    default:
                      throw new Error('the length of a float constant value must be between 1 and 4!');
                  }
                } else {
                  gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                  gl.enableVertexAttribArray(index);
                  gl.vertexAttribPointer(
                      index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                }
              };
          }

        const attribSetters = {};
        const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let ii = 0; ii < numAttribs; ++ii) {
          const attribInfo = gl.getActiveAttrib(program, ii);
          if (!attribInfo) {
            break;
          }
          const index = gl.getAttribLocation(program, attribInfo.name);
          attribSetters[attribInfo.name] = createAttribSetter(index);
        }
    
        return attribSetters;
    }

    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        function loadShaderProgram(gl, type, src) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
    
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert('Shader compile error! ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
    
            return shader;
        };

        // Load the vertex shader
        let vtx = document.getElementById(vertexShaderSource);
        vertexShaderSource = vtx ? vtx.text : vertexShaderSource;
        // Load the fragment shader
        let frg = document.getElementById(fragmentShaderSource);
        fragmentShaderSource = frg ? frg.text : fragmentShaderSource;

        // Create the shader program
        const program = gl.createProgram();
        const vertex = loadShaderProgram(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragment = loadShaderProgram(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Error compiling shader: ${gl.getProgramInfoLog(program)}`);
            gl.deleteProgram(program);
            return null;
        }

        // Attach uniforms and attributes
        const uniforms = loadUniformData(gl, program);
        const attributes = loadAttributeData(gl, program);

        return {
            program: program,
            attribSetters: attributes,
            uniformSetters: uniforms
        };
    }

    return {
        createProgram: createProgram,
    }
}));
