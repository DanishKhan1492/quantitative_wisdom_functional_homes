package com.qw.qwhomes.domains.colour.integration_tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.data.repository.ColourRepository;
import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ColourIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ColourRepository colourRepository;

    private Colour testColour;

    @BeforeEach
    void setUp() {
        colourRepository.deleteAll();
        
        testColour = new Colour();
        testColour.setName("Test Red");
        testColour.setCode("#FF0000");
        testColour.setDescription("Test red colour");
        testColour = colourRepository.save(testColour);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllColours_ShouldReturnColoursList() throws Exception {
        mockMvc.perform(get("/api/v1/colours"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].name", is("Test Red")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getColourById_ShouldReturnColour() throws Exception {
        mockMvc.perform(get("/api/v1/colours/{id}", testColour.getColourId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Test Red")))
                .andExpect(jsonPath("$.code", is("#FF0000")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createColour_ShouldReturnCreatedColour() throws Exception {
        ColourDTO newColour = new ColourDTO();
        newColour.setName("New Blue");
        newColour.setCode("#0000FF");
        newColour.setDescription("Test blue colour");

        mockMvc.perform(post("/api/v1/colours")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newColour)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("New Blue")))
                .andExpect(jsonPath("$.code", is("#0000FF")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateColour_ShouldReturnUpdatedColour() throws Exception {
        ColourDTO updateColour = new ColourDTO();
        updateColour.setName("Updated Red");
        updateColour.setCode("#FF0000");
        updateColour.setDescription("Updated red colour");

        mockMvc.perform(put("/api/v1/colours/{id}", testColour.getColourId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateColour)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Red")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteColour_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/colours/{id}", testColour.getColourId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "USER")
    void unauthorizedAccess_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(post("/api/v1/colours")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }
}
